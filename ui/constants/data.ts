import { NavItem } from "@/types";

export const navItems: { [key: string]: NavItem[] } = {
  admin: [
    {
      title: "Inicio",
      href: "/painel",
      icon: "dashboard",
      label: "Inicio",
    },
    {
      title: "Usuarios",
      href: "/admin/usuarios",
      icon: "users",
      label: "Usuarios",
    },
    {
      title: "Manter mapa",
      href: "/admin/manter-mapa",
      icon: "page",
      label: "Manter mapa",
    },
    {
      title: "Sair",
      //TODO: verificar essa opção de sair, pois não está fazendo o logou efetivo, simplesmente está navegando para tela de login
      href: "/",
      icon: "login",
      label: "sair",
    },
  ],
  concessionaria: [
    {
      title: "Painel",
      href: "/painel",
      icon: "dashboard",
      label: "Painel",
    },
    // {
    //   title: "Atualização de Projetos",
    //   href: "/concessionaria/atualizacao-projetos",
    //   icon: "page",
    //   label: "Projetos",
    // },
    {
      title: "Normas e Resoluções",
      href: "/normas",
      icon: "book",
      label: "Normas",
    },
    {
      title: "Exclusão de Pontos",
      href: "/concessionaria/excluir-pontos",
      icon: "trash",
      label: "Excluir Pontos",
    },
    // {
    //   title: "Faturamento",
    //   href: "/concessionaria/faturamento",
    //   icon: "billing",
    //   label: "Faturamento",
    // },
    {
      title: "Multas",
      href: "/concessionaria/multas",
      icon: "alert",
      label: "Multas",
    },
    {
      title: "Notificações",
      href: "/concessionaria/notificacoes",
      icon: "megaphone",
      label: "Notificações",
    },
    {
      title: "Projetos",
      href: "/concessionaria/projetos",
      icon: "calendarCheck",
      label: "Projetos",
    },
    {
      title: "Relatórios",
      href: "/concessionaria/relatorios",
      icon: "page",
      label: "Relatórios",
    },
    {
      title: "Inventario de Postes",
      href: "/concessionaria/inventario",
      icon: "list",
      label: "Inventario de Postes",
    },
    {
      title: "Sair",
      href: "/",
      icon: "login",
      label: "sair",
    },
  ],
  ocupante: [
    {
      title: "Inicio",
      href: "/painel",
      icon: "dashboard",
      label: "Inicio",
    },
    // {
    //   title: "Atualização de Projetos",
    //   href: "/ocupante/atualizacao-projetos",
    //   icon: "page",
    //   label: "Projetos",
    // },
    {
      title: "Normas e Resoluções",
      href: "/normas",
      icon: "book",
      label: "Normas",
    },
    {
      title: "Exclusão de Pontos",
      href: "/ocupante/excluir-pontos",
      icon: "trash",
      label: "Excluir Pontos",
    },
    // {
    //   title: "Faturamento",
    //   href: "/ocupante/faturamento",
    //   icon: "billing",
    //   label: "Faturamento",
    // },
    {
      title: "Multas",
      href: "/ocupante/multas",
      icon: "alert",
      label: "Multas",
    },
    {
      title: "Notificações",
      href: "/ocupante/notificacoes",
      icon: "megaphone",
      label: "Notificações",
    },
    {
      title: "Projetos",
      href: "/ocupante/projetos",
      icon: "calendarCheck",
      label: "Projetos",
    },
    {
      title: "Relatórios",
      href: "/ocupante/relatorios",
      icon: "page",
      label: "Relatorios",
    },
    // {
    //   title: "Transferência de Pontos",
    //   href: "/ocupante/transferir-pontos",
    //   icon: "chevronRight",
    //   label: "Transferencia de Pontos",
    // },
    {
      title: "Inventario de Postes",
      href: "/ocupante/inventario",
      icon: "list",
      label: "Inventario de Postes",
    },
    {
      title: "Sair",
      href: "/",
      icon: "login",
      label: "sair",
    },
  ],
};

export const excluirPontosMock  = [
  {
    id : 1,
    nomeProjeto : "Nome do Projeto",
    municipio : "Fortaleza",
    quantidadePontos : 100,
    dataSolicitacao : "03/01/2025",
    situacao : "Análise"
  },
  {
    id : 2,
    nomeProjeto : "Nome do Projeto 2",
    municipio : "Guarulhos",
    quantidadePontos : 200,
    dataSolicitacao : "04/02/2024",
    situacao : "Análise"
  }
]

export const mokHistorico = [
  {
    usuario : {
      id : 1,
      name : "Analista XPTO"
    },
    alignment : null,
    mensagem : "Mensagem de teste",
    data : "03/01/2025"
  },
  {
    usuario : {
      id : 1,
      name : "Analista XPTO"
    },
    alignment : null,
    mensagem : "Mensagem de teste",
    data : "03/01/2025"
  },
  {
    usuario : {
      id : 2,
      name : "Consecionaria XPTO"
    },
    alignment : null,
    mensagem : "Mensagem de teste 2",
    data : "03/01/2025"
  },
  {
    usuario : {
      id : 2,
      name : "Consecionaria XPTO"
    },
    alignment : null,
    mensagem : "Mensagem de teste 2",
    data : "03/01/2025"
  },
  {
    usuario : {
      id : 1,
      name : "Consecionaria XPTO"
    },
    alignment : null,
    mensagem : "Mensagem de teste 2",
    data : "03/01/2025"
  }
]

export const listPostMock = [
  {
    codigo: "codigo 1",
    cidadeCodigo: "cidade codigo",
    lat: "-3.9",
    lon: "-38.5",
    situacao: "D",
    possuiEquipamento: true,
    possuiEMS: true,
    descidaSub: true,
    caracteristicas: "caracteristicas",
    concessionariaId: 1234
  },
  {
    codigo: "codigo 2",
    cidadeCodigo: "cidade codigo",
    lat: "-3.9",
    lon: "-38.48",
    situacao: "D",
    possuiEquipamento: true,
    possuiEMS: true,
    descidaSub: true,
    caracteristicas: "caracteristicas",
    concessionariaId: 1234
  },
  {
    codigo: "codigo 2",
    cidadeCodigo: "cidade codigo",
    lat: "-3.9",
    lon: "-38.51",
    situacao: "N",
    possuiEquipamento: true,
    possuiEMS: true,
    descidaSub: true,
    caracteristicas: "caracteristicas",
    concessionariaId: 1234
  }
]

export const mockPontos = [
  {
      idPoste : "1",
      latitude : -37.45,
      longitude : 5.43
  },
  {
      idPoste : "2",
      latitude : -17.45,
      longitude : 3.43
  },
  {
      idPoste : "3",
      latitude : -37.45,
      longitude : 5.43
  },
  {
      idPoste : "4",
      latitude : -17.45,
      longitude : 3.43
  }
]

export const mockFiltroPerfil = [
{perfil: "Gestor Concessionária"},
{perfil: "Gerente Concessionária"},
{perfil: "Coordenador Concessionária"},
{perfil: "Analista Concessionária"},
{perfil: "Técnico Concessionaria"},
{perfil: "Gestor Ocupante"},
{perfil: "Gerente Ocupante" },
{perfil: "Coordenador Ocupante" },
{perfil: "Analista Ocupante" },
{perfil: "Técnico Ocupante" }
]

export const mockSituacaoFiltroPerfil = [
  {situacao: "Todos", valor: ""},
  {situacao: "Ativo ", valor: "Ativo"},
  {situacao: "Inativo", valor: "Inativo"}
]

export const usuariosMocadosTeste = [
  {
    id : 1,
    nome: "Carlos Henrique",
    email: "carloshenrique@teste.com",
    empresa: "Empresa Teste",
    concessionaria: "Concessionaria Teste",
    perfil: "Gerente Concessionária",
    situacao: "Ativo",
    empresaOcupante : "Empresa Teste",
    cpf: "024.432.000-43",
    telefone: "(99)99999-9999",
    modulos: "Atualização de Projetos"
  },
   {
    id : 2,
    nome: "Maria",
    email: "maria@teste.com",
    empresa: "Empresa Teste",
    concessionaria: "Concessionaria Teste",
    perfil: "Gerente Concessionária",
    situacao: "Inativo",
    empresaOcupante : "Empresa Teste",
    cpf: "605.688.080-02",
    telefone: "(99)99999-9999",
    modulos: "Normas e Resolução"
  },
   {
    id : 3,
    nome: "João",
    email: "joao@teste.com",
    empresa: "Empresa Teste",
    concessionaria: "Concessionaria Teste",
    perfil: "Gerente Concessionária",
    situacao: "Ativo",
    empresaOcupante : "Empresa Teste",
    cpf: "911.714.240-78",
    telefone: "(99)99999-9999",
    modulos: "Multas"
  },
]

export const usuarioHistoricoMock = [
  {
    id: 1,
    mensagens: [
      {
        data: "15/06/2025 16:30:00",
        situacaoAtual: "Ativo",
        situacaoAnterior: "Inativo",
        alteradoPor: "Usuario XPTO",
        empresaAtual: "Empresa XPTO 2",
        empresaAnterior: "Empresa XPTO 1"
      },
      {
        data: "24/06/2025 16:30:00",
        situacaoAtual: "Ativo",
        situacaoAnterior: "Ativo",
        alteradoPor: "Usuario XPTO",
        empresaAtual: "Empresa XPTO 8 ",
        empresaAnterior: "Empresa XPTO 9"
      }
    ]
  },
  {
    id: 2,
    mensagens: [
      {
        data: "23/06/2025 15:30:00",
        situacaoAtual: "Ativo",
        situacaoAnterior: "Inativo",
        alteradoPor: "Usuario XPTO 2",
        empresaAtual: "Empresa XPTO 3",
        empresaAnterior: "Empresa XPTO 4"
      }
    ]
  },
  {
    id: 3,
    mensagens: [
      {
        data: "22/06/2025 22:30:00",
        situacaoAtual: "Ativo",
        situacaoAnterior: "Inativo",
        alteradoPor: "Usuario XPTO 3",
        empresaAtual: "Empresa XPTO 6",
        empresaAnterior: "Empresa XPTO 5"
      }
    ]
  }
  
]

export const modulosMock = [
  {modulo: "Atualização de Projetos"},
  {modulo: "Normas e Resolução"},
  {modulo: "Exclusão de Pontos"},
  {modulo: "Faturamento"},
  {modulo: "Multas"},
  {modulo: "Notificação"},
  {modulo: "Projetos"},
  {modulo: "Relatórios"},
  {modulo: "Inventário de Postes"},
]

export const empresasMock = [
  {empresa: "Enel Energia"},
  {empresa: "Empresa Teste"},
  {empresa: "Energia Limpa Teste"},
]

export const usuarioVazio = {
  id : 0,
  nome: "",
  email: "",
  empresa: "",
  concessionaria: "",
  perfil: "",
  situacao: "",
  cpf: "",
  telefone: "",
  modulos: ""
}

export const mockInteracoes = [
    {
        id: 10,
        mensagem: "Reprovado por tempo excedido em pausa, sem resposta da Ocupante.",
        status: "RE",
        data: "2025-07-31T04:10:37.03502Z",
        usuario: {
            id: 1,
            name: "Admin"
        }
    },
    {
        id: 7,
        mensagem: "Início de análise do projeto",
        status: "AN",
        data: "2025-07-31T03:28:22.690241Z",
        usuario: {
            id: 2,
            name: "Concessionária Teste"
        }
    },
    {
        id: 6,
        mensagem: "Alteração de status de RA para FI",
        status: "FI",
        data: "2025-07-31T03:28:07.813545Z",
        usuario: {
            id: 3,
            name: "Ocupante Teste"
        }
    },
    {
        id: 8,
        mensagem: "Análise concluída. Status alterado de AN para PA. Motivo: testando o pause",
        status: "PA",
        data: "2025-07-25T03:43:00.288Z",
        usuario: {
            id: 2,
            name: "Concessionária Teste"
        }
    }
]
