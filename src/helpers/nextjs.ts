import path from "path";

export const getNextJsPageExtensions = async (rootPath: string): Promise<string[]> => {
  const defaultExtensions = [".tsx"];
  const configPath = path.join(rootPath, "next.config.js");

  const config = await import(configPath);

  if (!config) return defaultExtensions;

  return Array.isArray(config.pageExtensions) ? config.pageExtensions : defaultExtensions;
};
