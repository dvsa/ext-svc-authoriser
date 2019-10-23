// @ts-ignore
import * as yml from "node-yaml";

class Configuration {
    private readonly config: any;
    private static instance: Configuration;

    private constructor(configPath: string) {
        this.config = yml.readSync(configPath);

        // Replace environment variable references
        let stringifiedConfig: string = JSON.stringify(this.config);
        const envRegex: RegExp = /\${(\w+\b):?(\w+\b)?}/g;
        const matches: RegExpMatchArray | null = stringifiedConfig.match(envRegex);

        if (matches) {
            matches.forEach((match: string) => {
                envRegex.lastIndex = 0;
                const captureGroups: RegExpExecArray = envRegex.exec(match) as RegExpExecArray;

                // Insert the environment variable if available. If not, insert placeholder. If no placeholder, leave it as is.
                stringifiedConfig = stringifiedConfig.replace(match, (process.env[captureGroups[1]] || captureGroups[2] || captureGroups[1]));
            });
        }

        this.config = JSON.parse(stringifiedConfig);
    }

    /**
     * Get Instance
     * @param configPath
     */
    public static getInstance(configPath: string) {
        if (!this.instance) {
            this.instance = new Configuration(configPath);
        }

        return Configuration.instance;
    }

    /**
     * Get Config
     */
    public getConfig(): any {
        return this.config;
    }

}

export { Configuration };
