import fs from "fs/promises";
import path from "path";

export default defineEventHandler(async (event) => {
  try {
    // Cesta k writable JSON souboru
    const dataPath = path.join(process.cwd(), "data", "calendar_data.json");

    // Zkontroluj, jestli soubor existuje
    try {
      await fs.access(dataPath);
    } catch {
      // Pokud neexistuje, vytvoř ho s výchozími daty
      const defaultData = {
        options: [],
        dates: [],
        regularity: [],
        name: "Uživatel",
      };
      await fs.writeFile(dataPath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }

    // Načti a parsuj JSON
    const fileContent = await fs.readFile(dataPath, "utf-8");
    const data = JSON.parse(fileContent);

    return data;
  } catch (error) {
    console.error("❌ Chyba při načítání dat:", error);
    throw createError({
      statusCode: 500,
      message: "Chyba při načítání dat",
    });
  }
});
