interface IWebsiteData {
  id: string;
  nome: string;
  url_base: string;
  url_imoveis: string;
  district: string;
  state: string;
  tags: {
    property_tags: string[],
    card_body: string,
    neighborhood_tag: string,
    price_tag: string,
    property_url_tag: string,
    encoding?: {
      responseType: string,
    reponseEncoding: string
    }
  };
}

const sites  = [
  {
    id: "1",
    nome: "RICC Imobiliária",
    url_base: "https://www.imobiliariaricc.com.br",
    url_imoveis:
      "https://www.imobiliariaricc.com.br/imoveis/a-venda/casa/boa-vista",
    district: "Boa vista",
    state: "Roraima",
    tags: {
      "property_tags": [".card-title", ".h-money"],
      "card_body": ".card-listing",
      "neighborhood_tag": ".card-title",
      "price_tag": "div > p > span",
      "property_url_tag": "div > a",
    },
  },
  {
    id: "2",
    nome: "Amazonia imoveis",
    url_base: "https://www.amazoniaimoveis.com.br/",
    url_imoveis: "https://www.amazoniaimoveis.com.br/imoveis/imoveis.php",
    district: "Boa vista",
    state: "Roraima",
    tags: {
      "property_tags": [".detalhe2:last", "div > strong", "div > a"],
      "card_body": ".listar_destaques",
      "neighborhood_tag": ".detalhe2:last",
      "price_tag": "div > strong",
      "property_url_tag": "div > a",
      "encoding": "latin1"
    },
  },
  {
    id: "3",
    nome: "Gabriel Aleksander",
    url_base: "https://www.gabrielalessander.com.br/",
    url_imoveis:
      "https://www.gabrielalessander.com.br/pesquisa/imov_tipoLocal=urbano%7Cimov_idTipoNegocio=2%7Cimov_bairro=%7Cimov_idTipoImovel=%7Cimov_valorMinimo=%7Cimov_valorMaximo=",
    district: "Boa vista",
    state: "Roraima",
    tags: {
      "property_tags": ["h1 > strong", "h2 > strong", "div > a"],
      "card_body": ".card",
      "neighborhood_tag": "h1 > strong",
      "price_tag": "h2 > strong",
      "property_url_tag": "div > a",
    },
  },
  {
    id: "4",
    nome: "Capital imoveis",
    url_base: "https://capitalimoveis.com.br/",
    url_imoveis: "https://capitalimoveis.com.br/comprar",
    district: "Boa vista",
    state: "Roraima",
    tags: {
        "property_tags": ["p > br:nth-child(1)", "p > br:last", "div > a"],
        "card_body":".imovel",
        "neighborhood_tag": "p > br:nth-child(1)",
        "price_tag": "p > br:last",
        "property_url_tag": "div > a"
    }
  },
  {
    id: "5",
    nome: "Rl imobiliária",
    url_base: "http://www.rlimob.com.br/",
    url_imoveis:
      "http://www.rlimob.com.br/public/search?faixa_valor_request=&goalId=2&tipo=2&faixa_valor=0-0&ref=",
    district: "Boa vista",
    state: "Roraima",
    tags: {
      "property_tags": ["h3", "dl > dd"],
        "card_body":".swt-realty-preview",
        "neighborhood_tag": "h3",
        "price_tag": "dl > dd",
        "property_url_tag": ""
    },
  },
];
 export default sites;