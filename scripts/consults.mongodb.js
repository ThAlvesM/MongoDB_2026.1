//Selecionar (ou criar) o banco de dados
use('transportePublico')

//Buscar viagens concluídas com atraso, exibindo código, linha e minutos de atraso
db.viagens.find(
  { status: 'concluida', atraso_min: { $gt: 0 } },
  { codigo_viagem: 1, linha: 1, atraso_min: 1, _id: 0 }
)

//Retornar o primeiro veículo ativo designado ao BRT Sul com capacidade acima de 150
db.veiculos.findOne({
  linha_designada: 'BRT-SU',
  status: 'ativo',
  capacidade: { $gt: 150 }
})

//Encontrar passageiros que usam exatamente três linhas diferentes com frequência
db.passageiros.find({ linhas_frequentes: { $size: 3 } },
  { nome: 1, cartao: 1, linhas_frequentes: 1, _id: 0 }
)

//Pipeline completo: viagens concluídas agrupadas por linha, com total de passageiros, arrecadação total e média de atraso
db.viagens.aggregate([
  { $match: { status: 'concluida' } },
  { $group: {
    _id: '$linha',
    total_viagens:       { $sum: 1 },
    total_passageiros:   { $sum: '$passageiros_embarcados' },
    arrecadacao_total:   { $sum: '$valorArrecadado' },
    media_atraso_min:    { $avg: '$atraso_min' }
  }},
  { $sort: { arrecadacao_total: -1 } }
])

//Filtrar dentro de pipeline: apenas viagens do pico manhã (entre 6h e 9h) com lotação acima de 80% da capacidade
db.viagens.aggregate([
  { $match: {
    partida: { $gte: new Date('2024-04-15T06:00:00'), $lt: new Date('2024-04-15T09:00:00') },
    passageiros_embarcados: { $gte: 800 },
    status: 'concluida'
  }},
  { $project: { codigo_viagem: 1, linha: 1, partida: 1, passageiros_embarcados: 1, _id: 0 } }
])

//Projetar campos calculados: percentual de ocupação e classificação de lotação de cada viagem
db.viagens.aggregate([
  { $lookup: {
    from: 'veiculos', localField: 'prefixo_veiculo',
    foreignField: 'prefixo', as: 'veiculo'
  }},
  { $unwind: '$veiculo' },
  { $project: {
    codigo_viagem: 1, linha: 1,
    passageiros_embarcados: 1,
    capacidade: '$veiculo.capacidade',
    ocupacao_pct: {
      $round: [{ $multiply: [{ $divide: ['$passageiros_embarcados','$veiculo.capacidade'] }, 100] }, 1]
    }
  }}
])

//Buscar passageiros com saldo suficiente para ao menos 10 viagens (tarifa R$ 4,40)
db.passageiros.find(
  { saldo: { $gte: 44.00 }, ativo: true },
  { nome: 1, cartao: 1, saldo: 1, tipo_cartao: 1, _id: 0 }
).sort({ saldo: -1 })

//Agrupar motoristas por turno, calculando salário médio e total de ocorrências por turno
db.motoristas.aggregate([
  { $group: {
    _id: '$turno',
    total_motoristas: { $sum: 1 },
    salario_medio:    { $avg: '$salario' },
    total_ocorrencias: { $sum: { $size: '$ocorrencias' } }
  }},
  { $sort: { total_motoristas: -1 } }
])

//Calcular a arrecadação total e o total de passageiros transportados por tipo de modal
db.viagens.aggregate([
  { $lookup: { from: 'linhas', localField: 'linha', foreignField: 'codigo', as: 'dadosLinha' } },
  { $unwind: '$dadosLinha' },
  { $group: {
    _id: '$dadosLinha.tipo',
    arrecadacao_total: { $sum: '$valorArrecadado' },
    total_passageiros: { $sum: '$passageiros_embarcados' },
    total_viagens:     { $sum: 1 }
  }}
])

//Contar viagens por status e veiculos em cada situação operacional
// Total de viagens concluidas no dia
db.viagens.countDocuments({ status: 'concluida' })
 
// Veiculos disponiveis por status
db.veiculos.aggregate([
  { $group: { _id: '$status', quantidade: { $sum: 1 } } }
])
 
// Passageiros ativos com saldo positivo
db.passageiros.countDocuments({ ativo: true, saldo: { $gt: 0 } })

//Encontrar os valores extremos de operação: maior e menor arrecadação, maior atraso
db.viagens.aggregate([
  { $group: {
    _id: '$linha',
    maior_arrecadacao: { $max: '$valorArrecadado' },
    menor_arrecadacao: { $min: '$valorArrecadado' },
    maior_atraso_min:  { $max: '$atraso_min' },
    pico_passageiros:  { $max: '$passageiros_embarcados' }
  }}
])

//Calcular duração média das viagens e média de passageiros por linha, ordenado pelos mais movimentados
db.viagens.aggregate([
  { $group: {
    _id: '$linha',
    duracao_media_min:    { $avg: '$duracao_min' },
    media_passageiros:    { $avg: '$passageiros_embarcados' },
    media_arrecadacao:    { $avg: '$valorArrecadado' }
  }},
  { $sort: { media_passageiros: -1 } }
])

//Encontrar veículos que possuem histórico de manutenção corretiva registrado
// Veiculos com ao menos um registro de manutencao
db.veiculos.find({
  historico_manutencao: { $exists: true },
  'historico_manutencao.0': { $exists: true }
}, { prefixo: 1, modelo: 1, linha_designada: 1, _id: 0 })
 
// Motoristas sem nenhuma ocorrencia registrada
db.motoristas.find({
  ocorrencias: { $exists: true },
  'ocorrencias.0': { $exists: false }
}, { nome: 1, matricula: 1, _id: 0 })

//Listar passageiros ordenados por saldo decrescente e depois por nome crescente
db.passageiros.find(
  { ativo: true },
  { nome: 1, cartao: 1, saldo: 1, tipo_cartao: 1, _id: 0 }
).sort({ saldo: -1, nome: 1 })

//Top 3 viagens com maior numero de passageiros e paginação de resultados
// Top 3 viagens mais movimentadas
db.viagens.find({}, { codigo_viagem:1, linha:1, passageiros_embarcados:1, _id:0 })
  .sort({ passageiros_embarcados: -1 })
  .limit(3)
 
// Paginacao: pagina 2 (skip 2, take 2)
db.viagens.find().sort({ partida: 1 }).skip(2).limit(2)

//Localizar viagens onde o atraso representa mais de 30% da duração total prevista
db.viagens.find({
  $where: function() {
    return this.atraso_min > 0 && (this.atraso_min / this.duracao_min) > 0.30;
  }
}, { codigo_viagem: 1, linha: 1, duracao_min: 1, atraso_min: 1 })

//Calcular o custo total de manutencao acumulado por veículo usando MapReduce
db.veiculos.mapReduce(
  function() {
    var total = 0;
    this.historico_manutencao.forEach(function(m) { total += m.custo; });
    emit(this.prefixo, total);
  },
  function(prefixo, custos) { return Array.sum(custos); },
  { out: 'custo_manutencao_por_veiculo' }
)
// Consultar resultado:
db.custo_manutencao_por_veiculo.find().sort({ value: -1 })

//Calcular o valor da tarifa com desconto de 50% para cartão estudante usando $function
db.passageiros.aggregate([
  { $addFields: {
    tarifa_efetiva: {
      $function: {
        body: function(tipo, tarifa_base) {
          if (tipo === 'estudante') return tarifa_base * 0.5;
          if (tipo === 'idoso')     return 0;
          return tarifa_base;
        },
        args: ['$tipo_cartao', 4.40],
        lang: 'js'
      }
    },
    viagens_possiveis: {
      $function: {
        body: function(saldo, tipo) {
          var tarifa = tipo === 'estudante' ? 2.20 : (tipo === 'idoso' ? 0 : 4.40);
          return tarifa > 0 ? Math.floor(saldo / tarifa) : 9999;
        },
        args: ['$saldo', '$tipo_cartao'],
        lang: 'js'
      }
    }
  }},
  { $project: { nome: 1, tipo_cartao: 1, saldo: 1, tarifa_efetiva: 1, viagens_possiveis: 1, _id: 0 } }
])

//Exibir documento de uma linha com formatação detalhada
// No mongo shell legado:
db.linhas.findOne({ codigo: 'L1' }).pretty()
 
// No mongosh (formatacao automatica) -- para JSON explicitamente formatado:
EJSON.stringify(db.linhas.findOne({ codigo: 'L1' }), null, 2)

//Encontrar passageiros que utilizam todas as três linhas: L1, L3 e BRT-SU
db.passageiros.find(
  { linhas_frequentes: { $all: ['L1', 'L3', 'BRT-SU'] } },
  { nome: 1, cartao: 1, linhas_frequentes: 1, _id: 0 }
)

//Atualizar saldo do passageiro após recarga e registrar nova entrada no array de recargas
db.passageiros.updateOne(
  { cartao: 'BU-00445566' },
  {
    $inc: { saldo: 50.00 },
    $push: {
      recargas: { data: new Date(), valor: 50.00, canal: 'app' }
    },
    $set: { ultima_atualizacao: new Date() }
  }
)

//Busca textual em descrições de linhas e ocorrências de viagens
// Criar indice de texto composto
db.linhas.createIndex({ nome: 'text', descricao: 'text' })
db.viagens.createIndex({ 'ocorrencias.motivo': 'text' })
 
// Buscar linhas relacionadas a 'expresso' ou 'norte'
db.linhas.find(
  { $text: { $search: 'expresso norte' } },
  { score: { $meta: 'textScore' }, nome: 1, tipo: 1, _id: 0 }
).sort({ score: { $meta: 'textScore' } })
 
// Buscar ocorrencias de atraso por transito
db.viagens.find(
  { $text: { $search: 'transito acidente' } },
  { codigo_viagem: 1, linha: 1, _id: 0 }
)

//Filtrar dentro do array de paradas apenas as do tipo 'integração' de cada linha
db.linhas.aggregate([
  { $project: {
    codigo: 1, nome: 1, tipo: 1,
    estacoes_integracao: {
      $filter: {
        input: '$paradas',
        as:    'parada',
        cond:  { $eq: ['$$parada.tipo', 'integracao'] }
      }
    }
  }},
  { $match: { 'estacoes_integracao.0': { $exists: true } } }
])

//Atualizar status de todos os veículos de um fabricante e registrar data de revisão
// Agendar revisao em todos os veiculos Volvo
db.veiculos.updateMany(
  { fabricante: 'Volvo', status: 'ativo' },
  {
    $set: { proxima_revisao: new Date('2024-12-01') },
    $push: {
      historico_manutencao: {
        data: new Date('2024-12-01'), tipo: 'preventiva_agendada',
        custo: 0, tecnico: 'A definir'
      }
    }
  }
)
 
// Reativar motorista especifico e limpar ocorrencias antigas
db.motoristas.updateOne(
  { matricula: 'MOT-1003' },
  { $set: { ativo: true }, $set: { ocorrencias: [] } }
)

//Registrar nova viagem ou atualizar se o código já existir (upsert)
db.viagens.updateOne(
  { codigo_viagem: 'VG-20240415-006' },
  { $setOnInsert: {
    linha: 'L3', prefixo_veiculo: '7015',
    origem: 'Corinthians-Itaquera', destino: 'Palmeiras-Barra Funda',
    partida: new Date('2024-04-15T20:00:00'),
    passageiros_embarcados: 520, status: 'em_andamento',
    atraso_min: 0, valorArrecadado: 2288.00, ocorrencias: []
  }},
  { upsert: true }
)

//Renomear coleção de motoristas para operadores (refatoração do modelo)
db.motoristas.renameCollection('operadores')
 
// Verificar a renomeacao:
db.getCollectionNames()
 
// Renomear de volta para manter o padrao do projeto:
db.operadores.renameCollection('motoristas')

//Classificar cada viagem por nível de desempenho com base no atraso e na ocupação
db.viagens.aggregate([
  { $project: {
    codigo_viagem: 1, linha: 1,
    passageiros_embarcados: 1, atraso_min: 1,
    desempenho: {
      $cond: {
        if: { $and: [ { $eq: ['$atraso_min', 0] }, { $gte: ['$passageiros_embarcados', 800] } ] },
        then: 'otimo',
        else: {
          $cond: {
            if: { $lte: ['$atraso_min', 10] },
            then: 'bom',
            else: 'critico'
          }
        }
      }
    }
  }},
  { $sort: { desempenho: 1 } }
])

//Juntar viagens com dados do veículo e da linha para relatório consolidado de operação
db.viagens.aggregate([
  { $lookup: {
    from: 'veiculos',
    localField: 'prefixo_veiculo',
    foreignField: 'prefixo',
    as: 'veiculo'
  }},
  { $unwind: '$veiculo' },
  { $lookup: {
    from: 'linhas',
    localField: 'linha',
    foreignField: 'codigo',
    as: 'dadosLinha'
  }},
  { $unwind: '$dadosLinha' },
  { $project: {
    codigo_viagem: 1,
    'dadosLinha.nome': 1, 'dadosLinha.tipo': 1,
    'veiculo.modelo': 1, 'veiculo.capacidade': 1,
    passageiros_embarcados: 1, valorArrecadado: 1,
    atraso_min: 1, status: 1, _id: 0
  }},
  { $sort: { valorArrecadado: -1 } }
])

//Adicionar nova linha frequente ao passageiro sem duplicar e coletar conjunto de origens unicas das viagens
// Adicionar linha ao passageiro sem duplicar
db.passageiros.updateOne(
  { cartao: 'BU-00112233' },
  { $addToSet: { linhas_frequentes: 'BRT-SU' } }
)
 
// Coletar conjunto unico de origens de viagens por linha
db.viagens.aggregate([
  { $group: {
    _id: '$linha',
    origens_unicas:  { $addToSet: '$origem' },
    destinos_unicos: { $addToSet: '$destino' }
  }},
  { $project: {
    _id: 1,
    total_origens:  { $size: '$origens_unicas' },
    origens_unicas: 1,
    destinos_unicos: 1
  }}
])
