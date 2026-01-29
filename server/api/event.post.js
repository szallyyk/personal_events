import fs from "fs/promises";
import path from "path";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const dataPath = path.join(process.cwd(), "data", "calendar_data.json");

    // Načti stávající data (abys zachoval options)
    let existingData;
    try {
      const fileContent = await fs.readFile(dataPath, "utf-8");
      existingData = JSON.parse(fileContent);
    } catch {
      existingData = {
        options: [],
        dates: [],
        regularity: [],
        name: "Uživatel",
      };
    }

    // Aktualizuj pouze dates
    existingData.dates = body.dates;

    // Zapiš zpět do souboru
    await fs.writeFile(
      dataPath,
      JSON.stringify(existingData, null, 2),
      "utf-8",
    );

    return { success: true };
  } catch (error) {
    console.error("❌ Chyba při ukládání:", error);
    throw createError({
      statusCode: 500,
      message: "Chyba při ukládání dat",
    });
  }
});
