
import { App, PluginSettingTab, Setting } from 'obsidian';
import RedditNotesPlugin from './main';

export interface SubredditConfig {
    name: string;
    category: string; // e.g., 'hot', 'new', 'rising', 'best', 'top'
}

export interface RedditNotesPluginSettings {
    subreddits: SubredditConfig[];
    postFilters: string[];
    noteLimit: number;
    baseFolderPath: string;
}

export const DEFAULT_SETTINGS: RedditNotesPluginSettings = {
    subreddits: [],
    postFilters: [],
    noteLimit: 10,
    baseFolderPath: 'Reddit',
};

export class RedditNotesSettingTab extends PluginSettingTab {
    plugin: RedditNotesPlugin;

    constructor(app: App, plugin: RedditNotesPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h2', { text: 'Reddit Notes Plugin Settings' });

        new Setting(containerEl)
            .setName('Base Folder Path')
            .setDesc('The base folder where Reddit notes will be saved. Leave blank for vault root. (e.g., Reddit or My Notes/Reddit)')
            .addText(text => text
                .setPlaceholder('e.g. Reddit')
                .setValue(this.plugin.settings.baseFolderPath)
                .onChange(async (value) => {
                    this.plugin.settings.baseFolderPath = value.trim();
                    await this.plugin.saveSettings();
                }));

        const subredditSettingsContainer = containerEl.createDiv();
        this.buildSubredditSettings(subredditSettingsContainer);

        new Setting(containerEl)
            .setName('Post Filters')
            .setDesc('Enter keywords to filter out posts, separated by commas. Posts containing any of these keywords will be ignored.')
            .addText(text => text
                .setPlaceholder('e.g. meme, politics')
                .setValue(this.plugin.settings.postFilters.join(', '))
                .onChange(async (value) => {
                    this.plugin.settings.postFilters = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Note Generation Limit')
            .setDesc('Set the maximum number of notes to generate per batch.')
            .addText(text => text
                .setPlaceholder('e.g. 10')
                .setValue(this.plugin.settings.noteLimit.toString())
                .onChange(async (value) => {
                    const limit = parseInt(value);
                    if (!isNaN(limit) && limit > 0) {
                        this.plugin.settings.noteLimit = limit;
                        await this.plugin.saveSettings();
                    }
                }));
    }

    buildSubredditSettings(containerEl: HTMLElement): void {
        containerEl.empty(); // Clear only the subreddit settings container
        containerEl.createEl('h3', { text: 'Subreddit Configuration' });

        this.plugin.settings.subreddits.forEach((subredditConfig, index) => {
            new Setting(containerEl)
                .setName(`Subreddit: ${subredditConfig.name}`)
                .addText(text => text
                    .setPlaceholder('Subreddit Name')
                    .setValue(subredditConfig.name)
                    .onChange(async (value) => {
                        subredditConfig.name = value.trim();
                        await this.plugin.saveSettings();
                    }))
                .addDropdown(dropdown => dropdown
                    .addOption('hot', 'Hot')
                    .addOption('new', 'New')
                    .addOption('rising', 'Rising')
                    .addOption('best', 'Best')
                    .addOption('top', 'Top')
                    .setValue(subredditConfig.category)
                    .onChange(async (value) => {
                        subredditConfig.category = value;
                        await this.plugin.saveSettings();
                    }))
                .addButton(button => button
                    .setButtonText('Remove')
                    .onClick(async () => {
                        this.plugin.settings.subreddits.splice(index, 1);
                        await this.plugin.saveSettings();
                        this.display(); // Re-render settings to reflect changes
                    }));
        });

        new Setting(containerEl)
            .addButton(button => button
                .setButtonText('Add Subreddit')
                .setCta()
                .onClick(async () => {
                    this.plugin.settings.subreddits.push({ name: '', category: 'hot' }); // Default to hot
                    await this.plugin.saveSettings();
                    this.display(); // Re-render settings to show new subreddit
                }));
    }
}
