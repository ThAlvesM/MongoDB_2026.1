// Desativar veiculo em manutencao e registrar responsavel
db.veiculos.updateOne(
  { prefixo: 'BRT-058' },
  { $set: { status: 'manutencao', responsavel_manutencao: 'Carlos Ramos',
            data_entrada_manutencao: new Date() } }
)
 
// Remover passageiros inativos sem nenhuma recarga registrada
db.passageiros.deleteMany({
  ativo: false,
  'recargas': { $size: 0 }
})
