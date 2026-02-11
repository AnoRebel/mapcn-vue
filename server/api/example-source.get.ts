import { readFileSync } from "node:fs";
import { join } from "node:path";

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const filename = query.filename as string;

  if (!filename) {
    throw createError({
      statusCode: 400,
      statusMessage: "Filename is required",
    });
  }

  // Security: only allow .vue files
  if (!filename.endsWith(".vue")) {
    throw createError({ statusCode: 400, statusMessage: "Invalid file type" });
  }

  try {
    // Try multiple possible locations
    const possiblePaths = [
      join(process.cwd(), "app/components/docs/examples", filename),
      join(process.cwd(), "app/components/examples", filename),
    ];

    for (const filePath of possiblePaths) {
      try {
        const source = readFileSync(filePath, "utf-8");
        return source
          .replace(/~{1,2}\/registry\/map/g, "@/components/ui/map")
          .replace(/~\/components\/ui\//g, "@/components/ui/");
      } catch {
        continue;
      }
    }

    throw createError({ statusCode: 404, statusMessage: "File not found" });
  } catch (error) {
    if (error instanceof Error && "statusCode" in error) throw error;
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to read file",
    });
  }
});
