use('transportePublico')
 
// ==================== COLECAO: linhas ====================
db.linhas.insertMany([
  { codigo: 'L1', nome: 'Linha 1 - Azul', tipo: 'metro',
    paradas: [
      { ordem: 1, nome: 'Tucuruvi',        tipo: 'terminal',      coordenadas: { lat: -23.4738, lon: -46.6126 } },
      { ordem: 2, nome: 'Parada Inglesa',  tipo: 'intermediaria', coordenadas: { lat: -23.4875, lon: -46.6149 } },
      { ordem: 3, nome: 'Tiete',           tipo: 'intermediaria', coordenadas: { lat: -23.5147, lon: -46.6256 } },
      { ordem: 4, nome: 'Republica',       tipo: 'integracao',    coordenadas: { lat: -23.5434, lon: -46.6428 } },
      { ordem: 5, nome: 'Se',              tipo: 'integracao',    coordenadas: { lat: -23.5501, lon: -46.6333 } },
      { ordem: 6, nome: 'Jabaquara',       tipo: 'terminal',      coordenadas: { lat: -23.6277, lon: -46.6224 } }
    ],
    capacidade_por_composicao: 1080, composicoes_ativas: 28,
    tarifa: 4.40, ativa: true, ano_inauguracao: 1974,
    descricao: 'Primeira linha do metro de Sao Paulo, sentido norte-sul' },
 
  { codigo: 'L3', nome: 'Linha 3 - Vermelha', tipo: 'metro',
    paradas: [
      { ordem: 1, nome: 'Palmeiras-Barra Funda', tipo: 'terminal',      coordenadas: { lat: -23.5259, lon: -46.6618 } },
      { ordem: 2, nome: 'Marechal Deodoro',      tipo: 'intermediaria', coordenadas: { lat: -23.5367, lon: -46.6496 } },
      { ordem: 3, nome: 'Republica',              tipo: 'integracao',    coordenadas: { lat: -23.5434, lon: -46.6428 } },
      { ordem: 4, nome: 'Pedro II',               tipo: 'intermediaria', coordenadas: { lat: -23.5469, lon: -46.6311 } },
      { ordem: 5, nome: 'Bras',                   tipo: 'intermediaria', coordenadas: { lat: -23.5399, lon: -46.6118 } },
      { ordem: 6, nome: 'Corinthians-Itaquera',   tipo: 'terminal',      coordenadas: { lat: -23.5454, lon: -46.4556 } }
    ],
    capacidade_por_composicao: 1080, composicoes_ativas: 32,
    tarifa: 4.40, ativa: true, ano_inauguracao: 1979,
    descricao: 'Linha leste-oeste, maior extensao da rede metro SP' },
 
  { codigo: 'BRT-SU', nome: 'BRT Sul', tipo: 'BRT',
    paradas: [
      { ordem: 1, nome: 'Terminal Capelinha',   tipo: 'terminal',      coordenadas: { lat: -23.6714, lon: -46.7642 } },
      { ordem: 2, nome: 'Largo Treze',          tipo: 'intermediaria', coordenadas: { lat: -23.6513, lon: -46.7223 } },
      { ordem: 3, nome: 'Praca da Arvore',      tipo: 'intermediaria', coordenadas: { lat: -23.6281, lon: -46.6598 } },
      { ordem: 4, nome: 'Terminal Jabaquara',   tipo: 'terminal',      coordenadas: { lat: -23.6277, lon: -46.6224 } }
    ],
    capacidade_por_composicao: 160, composicoes_ativas: 15,
    tarifa: 4.40, ativa: true, ano_inauguracao: 2016,
    descricao: 'Corredor expresso de onibus articulado zona sul' }
])
 
// ==================== COLECAO: veiculos ====================
db.veiculos.insertMany([
  { prefixo: '7001', tipo: 'composicao_metro', modelo: 'CAF Serie 7000',
    fabricante: 'CAF', ano_fabricacao: 2012, capacidade: 1080,
    linha_designada: 'L1', status: 'ativo',
    especificacoes: { motores: 8, potencia_kw: 4400, ar_condicionado: true, acessivel: true },
    historico_manutencao: [
      { data: new Date('2024-01-15'), tipo: 'preventiva', custo: 18500.00, tecnico: 'Joao Ferreira' },
      { data: new Date('2024-06-10'), tipo: 'corretiva',  custo: 42000.00, tecnico: 'Marina Silva' }
    ]},
  { prefixo: '7015', tipo: 'composicao_metro', modelo: 'CAF Serie 7000',
    fabricante: 'CAF', ano_fabricacao: 2013, capacidade: 1080,
    linha_designada: 'L3', status: 'ativo',
    especificacoes: { motores: 8, potencia_kw: 4400, ar_condicionado: true, acessivel: true },
    historico_manutencao: [
      { data: new Date('2024-03-20'), tipo: 'preventiva', custo: 19200.00, tecnico: 'Joao Ferreira' }
    ]},
  { prefixo: 'BRT-042', tipo: 'articulado', modelo: 'Volvo B340M Articul',
    fabricante: 'Volvo', ano_fabricacao: 2018, capacidade: 160,
    linha_designada: 'BRT-SU', status: 'ativo',
    especificacoes: { motores: 1, potencia_kw: 250, ar_condicionado: true, acessivel: true },
    historico_manutencao: [
      { data: new Date('2024-02-05'), tipo: 'preventiva', custo: 3800.00,  tecnico: 'Carlos Ramos' },
      { data: new Date('2024-07-18'), tipo: 'corretiva',  custo: 9500.00,  tecnico: 'Carlos Ramos' }
    ]},
  { prefixo: 'BRT-058', tipo: 'articulado', modelo: 'Mercedes-Benz O-500UA',
    fabricante: 'Mercedes-Benz', ano_fabricacao: 2019, capacidade: 160,
    linha_designada: 'BRT-SU', status: 'manutencao',
    especificacoes: { motores: 1, potencia_kw: 260, ar_condicionado: true, acessivel: true },
    historico_manutencao: [
      { data: new Date('2024-08-01'), tipo: 'corretiva', custo: 15000.00, tecnico: 'Carlos Ramos' }
    ]}
])
 
// ==================== COLECAO: motoristas ====================
db.motoristas.insertMany([
  { matricula: 'MOT-1001', nome: 'Roberto Alves', cpf: '321.654.987-00',
    habilitacao: { categoria: 'D', validade: new Date('2026-05-10'), renach: 'SP123456' },
    turno: 'manha', linha_designada: 'BRT-SU',
    admissao: new Date('2015-03-01'), salario: 3800.00, ativo: true,
    ocorrencias: [
      { data: new Date('2024-03-10'), tipo: 'atraso', descricao: 'Transito na Marginal' }
    ]},
  { matricula: 'MOT-1002', nome: 'Patricia Lima', cpf: '654.321.098-11',
    habilitacao: { categoria: 'D', validade: new Date('2025-11-20'), renach: 'SP654321' },
    turno: 'tarde', linha_designada: 'BRT-SU',
    admissao: new Date('2018-07-15'), salario: 3800.00, ativo: true,
    ocorrencias: [] },
  { matricula: 'MOT-1003', nome: 'Fernando Costa', cpf: '789.012.345-22',
    habilitacao: { categoria: 'E', validade: new Date('2024-09-30'), renach: 'SP789012' },
    turno: 'noite', linha_designada: 'BRT-SU',
    admissao: new Date('2010-01-10'), salario: 4200.00, ativo: false,
    ocorrencias: [
      { data: new Date('2024-01-05'), tipo: 'acidente', descricao: 'Colisao leve no terminal' },
      { data: new Date('2024-07-22'), tipo: 'falta',    descricao: 'Falta sem justificativa' }
    ]}
])
 
// ==================== COLECAO: passageiros ====================
db.passageiros.insertMany([
  { cartao: 'BU-00112233', nome: 'Ana Carolina Mendes', cpf: '111.222.333-44',
    saldo: 52.80, tipo_cartao: 'comum',
    recargas: [
      { data: new Date('2024-06-01'), valor: 50.00, canal: 'app' },
      { data: new Date('2024-07-15'), valor: 50.00, canal: 'totem' }
    ],
    linhas_frequentes: ['L1', 'L3'], ativo: true, cadastro: new Date('2021-04-20') },
  { cartao: 'BU-00445566', nome: 'Bruno Henrique Souza', cpf: '555.666.777-88',
    saldo: 6.60, tipo_cartao: 'estudante',
    recargas: [
      { data: new Date('2024-07-01'), valor: 20.00, canal: 'app' }
    ],
    linhas_frequentes: ['BRT-SU'], ativo: true, cadastro: new Date('2022-08-05') },
  { cartao: 'BU-00778899', nome: 'Claudia Ferreira', cpf: '999.888.777-66',
    saldo: 0.00, tipo_cartao: 'idoso',
    recargas: [],
    linhas_frequentes: ['L1'], ativo: false, cadastro: new Date('2019-02-14') },
  { cartao: 'BU-00334455', nome: 'Diego Martins', cpf: '444.333.222-11',
    saldo: 123.40, tipo_cartao: 'comum',
    recargas: [
      { data: new Date('2024-05-10'), valor: 100.00, canal: 'app' },
      { data: new Date('2024-06-20'), valor: 100.00, canal: 'app' },
      { data: new Date('2024-07-30'), valor: 50.00,  canal: 'totem' }
    ],
    linhas_frequentes: ['L1', 'L3', 'BRT-SU'], ativo: true, cadastro: new Date('2020-11-01') }
])
 
// ==================== COLECAO: viagens ====================
db.viagens.insertMany([
  { codigo_viagem: 'VG-20240415-001', linha: 'L1', prefixo_veiculo: '7001',
    origem: 'Tucuruvi', destino: 'Jabaquara',
    partida: new Date('2024-04-15T06:00:00'), chegada: new Date('2024-04-15T06:48:00'),
    duracao_min: 48, passageiros_embarcados: 834, passageiros_desembarcados: 821,
    status: 'concluida', atraso_min: 0, valorArrecadado: 3669.60,
    ocorrencias: [] },
  { codigo_viagem: 'VG-20240415-002', linha: 'L1', prefixo_veiculo: '7001',
    origem: 'Jabaquara', destino: 'Tucuruvi',
    partida: new Date('2024-04-15T07:10:00'), chegada: new Date('2024-04-15T08:05:00'),
    duracao_min: 55, passageiros_embarcados: 1056, passageiros_desembarcados: 1044,
    status: 'concluida', atraso_min: 7, valorArrecadado: 4646.40,
    ocorrencias: [{ tipo: 'atraso', motivo: 'Falha tecnica na porta do vagao 3' }] },
  { codigo_viagem: 'VG-20240415-003', linha: 'L3', prefixo_veiculo: '7015',
    origem: 'Palmeiras-Barra Funda', destino: 'Corinthians-Itaquera',
    partida: new Date('2024-04-15T07:00:00'), chegada: new Date('2024-04-15T08:02:00'),
    duracao_min: 62, passageiros_embarcados: 1080, passageiros_desembarcados: 1078,
    status: 'concluida', atraso_min: 0, valorArrecadado: 4752.00,
    ocorrencias: [] },
  { codigo_viagem: 'VG-20240415-004', linha: 'BRT-SU', prefixo_veiculo: 'BRT-042',
    origem: 'Terminal Capelinha', destino: 'Terminal Jabaquara',
    partida: new Date('2024-04-15T07:30:00'), chegada: new Date('2024-04-15T08:15:00'),
    duracao_min: 45, passageiros_embarcados: 152, passageiros_desembarcados: 148,
    status: 'concluida', atraso_min: 5, valorArrecadado: 668.80,
    ocorrencias: [{ tipo: 'lotacao', motivo: 'Capacidade maxima atingida na parada Largo Treze' }] },
  { codigo_viagem: 'VG-20240415-005', linha: 'BRT-SU', prefixo_veiculo: 'BRT-042',
    origem: 'Terminal Jabaquara', destino: 'Terminal Capelinha',
    partida: new Date('2024-04-15T18:00:00'), chegada: new Date('2024-04-15T19:10:00'),
    duracao_min: 70, passageiros_embarcados: 158, passageiros_desembarcados: 155,
    status: 'concluida', atraso_min: 25, valorArrecadado: 695.20,
    ocorrencias: [{ tipo: 'atraso', motivo: 'Acidente de transito na Av. Cupece' }] }
])
