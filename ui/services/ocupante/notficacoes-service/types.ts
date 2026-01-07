// export type NotificacaoResponseType = {
//   id: number,
//   updatedAt: string,
//   createdAt: string,
//   motivo: string,
//   cidadeId: number,
//   prazo: string
// }

export type HistoricoNotificacao = {
  
    id: number,
    mensagem: string,
    data: string,
    usuario: {
        id: number,
        name: string,
        email: string
    },
    arquivos: any[]
}

export type NotificacaoResponseType ={
    "id": number,
    "motivo": string,
    "cidade": {
        "id": number,
        "nome": string,
        "uf": string,
        "codigoIbge": string,
        "centroLat": string,
        "centroLon": string
    },
    "empresa": {
        "id": number,
        "nomeFantasia": string,
        "razaoSocial": string
    },
    "tipo": {
        "id": number,
        "tipo": string,
        "permiteInteracao": boolean
    },
    "dataEnviada": string,
    "dataVisualizada": string,
    "dataPrazo": string,
    "prazo": number,
    "status": string,
    "maximoInteracoes": number,
    "arquivos": [
        {
            "id": number,
            "nome": string,
            "tamanho": number,
            "key": string,
            "url": string
        }
    ],
    "solicitante": {
        "id": number,
        "name": string,
        "email": string
    },
    "ocupanteDataVisualizada": string
}