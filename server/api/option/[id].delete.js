import fs from "fs/promises";
import path from "path";

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params?.id || "0");
    const dataPath = path.join(process.cwd(), "data", "calendar_data.json");

    // Načti data
    const fileContent = await fs.readFile(dataPath, "utf-8");
    const data = JSON.parse(fileContent);

    // Zkontroluj, jestli index existuje
    if (id < 0 || id >= data.options.length) {
      throw createError({
        statusCode: 404,
        message: "Událost nenalezena",
      });
    }

    // Smaž událost podle indexu
    data.options.splice(id, 1);

    // Zapiš zpět
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), "utf-8");

    return { success: true };
  } catch (error) {
    console.error("❌ Chyba při mazání:", error);
    throw createError({
      statusCode: 500,
      message: "Chyba při mazání události",
    });
  }
});
