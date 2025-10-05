export default async function convertTableToJson(page, tableRowLocator) {
  console.log(`[Helper] Converting Table to JSON [localtor: ${tableRowLocator}]`);
  return await page.$$eval(tableRowLocator, (rows) => {
    if (rows.length === 0) {
      return [];
    }

    const headers = Array.from(rows[0].closest('table').querySelectorAll('thead th')).map((th) =>
      th.innerText.trim()
    );

    return rows.map((tableRow) => {
      const cells = Array.from(tableRow.querySelectorAll('td'));
      const convertedUserObject = {};

      headers.forEach((header, i) => {
        let value = cells[i]?.innerText.trim() || null;

        if (header.toLowerCase() === 'age' && value) {
          value = parseInt(value, 10);
        }
        if (header.toLowerCase() === 'salary' && value) {
          value = parseFloat(value.replace(/[^0-9.-]+/g, ''));
        }

        convertedUserObject[header] = value;
      });

      return convertedUserObject;
    });
  });
}
