import { Plugin, MarkdownView, Notice, request, TFile } from "obsidian";

import { RedditNotesPluginSettings, DEFAULT_SETTINGS, RedditNotesSettingTab } from './settings';

export default class RedditNotesPlugin extends Plugin {
    settings!: RedditNotesPluginSettings;

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

  async onload() {
    await this.loadSettings();

    this.addSettingTab(new RedditNotesSettingTab(this.app, this));

    this.addCommand({
      id: 'fetch-reddit-posts',
      name: 'Fetch Reddit Posts and Create Notes',
      callback: async () => {
        new Notice('Fetching Reddit posts...');
        await this.fetchAndCreateNotes();
      }
    });
  }

  async fetchAndCreateNotes() {
    const { subreddits, postFilters, noteLimit } = this.settings;

    if (subreddits.length === 0) {
      new Notice('Please add at least one subreddit in the plugin settings.');
      return;
    }

    for (const subredditConfig of subreddits) {
      const category = subredditConfig.category;
      try {
        const url = `https://www.reddit.com/r/${subredditConfig.name}/${category}.json?limit=100`; // Fetch more to allow for filtering
        const response = await request({ url });
        const data = JSON.parse(response);
        const posts = data.data.children;

        let notesCreated = 0;
        for (const post of posts) {
          const postData = post.data;

          // Apply post filters
          if (postFilters.some(filter => postData.title.toLowerCase().includes(filter.toLowerCase()) || postData.selftext.toLowerCase().includes(filter.toLowerCase()))) {
            continue;
          }

          const noteTitle = `Reddit - ${postData.subreddit} - ${postData.title}`.replace(/[/\\?%*:|"<>%]*/g, '');
          const baseFolder = this.settings.baseFolderPath ? `${this.settings.baseFolderPath}/` : '';
          const subredditFolderPath = `${baseFolder}${postData.subreddit}`;
          const filePath = `${subredditFolderPath}/${noteTitle}.md`;

          // Ensure the base Reddit folder exists
          if (this.settings.baseFolderPath && !await this.app.vault.adapter.exists(this.settings.baseFolderPath)) {
            await this.app.vault.createFolder(this.settings.baseFolderPath);
          }

          // Ensure the subreddit folder exists
          if (!await this.app.vault.adapter.exists(subredditFolderPath)) {
            await this.app.vault.createFolder(subredditFolderPath);
          }

          // Create or update the subreddit index note
          const subredditIndexFilePath = `${subredditFolderPath}/${postData.subreddit}.md`;
          if (!await this.app.vault.adapter.exists(subredditIndexFilePath)) {
            await this.app.vault.create(subredditIndexFilePath, `# ${postData.subreddit} Reddit Posts\n\n`);
          }

          // Append post link to subreddit index note
          const subredditIndexFile = this.app.vault.getAbstractFileByPath(subredditIndexFilePath) as TFile;
          const subredditIndexContent = await this.app.vault.read(subredditIndexFile);
          const newLink = `* [[${noteTitle}]]\n`;
          if (!subredditIndexContent.includes(newLink)) {
            await this.app.vault.modify(subredditIndexFile, subredditIndexContent + newLink);
          }

          const fileExists = await this.app.vault.adapter.exists(filePath);

          if (fileExists) {
            console.log(`Note already exists for: ${noteTitle}. Skipping.`);
            continue;
          }

          if (notesCreated >= noteLimit) {
            new Notice(`Reached note limit for ${subredditConfig.name} (${category}). Skipping remaining posts.`);
            break;
          }

          const noteContent = `\n# ${postData.title}\n\n**Subreddit:** [[${postData.subreddit}]]\n**Author:** ${postData.author}\n**URL:** ${postData.url}\n**Created:** ${new Date(postData.created_utc * 1000).toLocaleString()}\n\n---\n\n${postData.selftext || ''}\n\n---\n\n[View on Reddit](${postData.permalink})\n`;

          await this.app.vault.create(filePath, noteContent);
          new Notice(`Created note: ${noteTitle}`);
          notesCreated++;
        }
        new Notice(`Finished processing r/${subredditConfig.name} (${category}). Created ${notesCreated} new notes.`);

      } catch (error) {
        console.error(`Error fetching posts from r/${subredditConfig.name} (${category}):`, error);
        new Notice(`Error fetching posts from r/${subredditConfig.name} (${category}). See console for details.`);
      }
    }
    new Notice('Finished fetching all Reddit posts.');
  }

  onunload() {
    console.log('unloading plugin');
  }
}