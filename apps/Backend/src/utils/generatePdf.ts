import bwipjs from "bwip-js"
import puppeteer from "puppeteer";


export const generatePicklistHTML = (orders: any[], picklistCode: string, barcode: any) => `
  <html>
      <head>
        <style>
          body { font-family: Arial; padding: 40px; }
          h1 { text-align: center; color: #333; }
          p { font-size: 15px; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            padding: 10px;
            text-align: left;
            border: 1px solid #ddd;
          }
          th {
            background-color: #CCCCCC;
            color: black;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
      <img src="${barcode}" alt="Barcode" style="width: 200px; height: 50ps; margin-bottom: 2px;" />
        <p><strong>Picklist Code:</strong> ${picklistCode}</p>
        <p><strong>Picklist Type:</strong> SINGLE + MULTI</p>
        <p><strong>Store:</strong> MYNSTARS</p>
        <p><strong>Generated On:</strong> ${new Date().toLocaleString()}</p>

        <table>
          <thead>
            <tr>
              <th>Mynstars SKU Code</th>
              <th>Seller SKU Code</th>
              <th>Product Description</th>
              <th>Quantity</th>
              <th>Expiry Dates</th>
            </tr>
          </thead>
          <tbody>
            ${orders
              .map(
                (order) => `
                  <tr>
                    <td>${order.productSku}</td>
                    <td>${order.sellerSku}</td>
                    <td>${order.productName}</td>
                    <td>${order.productQuantity}</td>
                    <td>N/A</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
`;

export const generatePdf = async (ordersdata: any[], picklistCode: string, barcode: any) => {
  const htmlContent = generatePicklistHTML(ordersdata, picklistCode, barcode);

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
        format: "A4",
    })

    await browser.close();
    return pdfBuffer;
};


export const generateBarcode = async (text: any) =>{
  const buffer = await bwipjs.toBuffer({
    bcid: 'code128',       // Barcode type
    text: text,            // Text to encode
    scale: 3,             // Scaling factor
    height: 10,           // Height of the barcode in mm
    includetext: false,    // Include text below the barcode
  });

  return `data:image/png;base64,${buffer.toString('base64')}`;
}


