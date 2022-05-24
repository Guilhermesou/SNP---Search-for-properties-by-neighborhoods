import axios from "axios";
import cheerio from "cheerio";


function checkIfTagIsMoneyAndReturnFloatNumber(text = "") {
  if (text.includes("R$") === true && text.includes("\n") === false) {
    const moneyValue = text.replace(/[^0-9]/g, "");
    return parseFloat(moneyValue);
  }
  return text;
}

interface IWebsiteData {
  id: string;
  nome: string;
  url_base: string;
  url_imoveis: string;
  district: string;
  state: string;
  tags: {
    property_tags: string[];
    card_body: string;
    neighborhood_tag: string;
    price_tag: string;
    property_url_tag: string;
    encoding?: string;
  };
}

type IPropertyData = {
  district: string;
  price: number;
  url: string;
};


async function Scrapper(data: IWebsiteData) {
  let properties: Array<IPropertyData> = [];

  let next = true;
  
  if (next) {
    const pageContent = await axios(
      data.url_imoveis,
      data.tags.encoding
        ? {
            responseType: "arraybuffer",
            responseEncoding: "binary",
          }
        : {  }
    );
    const pageContentToString = pageContent.data.toString(
      data.tags.encoding ? "latin1" : ""
    );
    const $ = cheerio.load(pageContentToString);
    const card_body = data.tags.card_body;
    
    $(card_body, pageContentToString).each(function (this: cheerio.Element) {
      let propertyData: IPropertyData = {district: "", price: 0, url: ""};
      
      data.tags.property_tags.forEach((tag) => {
        const textoDaTag = $(this).find(tag).first().text();
        const hrefAttribute = $(this).find("a").attr("href");
        const title =
          $(this).find("a").first().attr("title") ||
          $(this).find(data.tags.neighborhood_tag).text();

        const value = checkIfTagIsMoneyAndReturnFloatNumber(textoDaTag);

        propertyData = {
          district: title,
          price: typeof value === "number" ? value : 0,
          url: hrefAttribute?.includes(data.url_base)
            ? hrefAttribute
            : data.url_base + hrefAttribute,
        };
        
      });

      properties.push(propertyData);
      next = false;
    });
  }
  return properties;
}


/*async function getAqui() {
  const site = sites.find((item) => item.id === "1") as IWebsiteData
  const result = await Scrapper(site)
}

getAqui()*/

export default Scrapper;
