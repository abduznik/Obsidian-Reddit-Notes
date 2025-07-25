# Obsidian Reddit Notes Plugin

This plugin allows you to fetch posts from specified subreddits and save them as individual notes in your Obsidian vault. It also creates an index note for each subreddit, linking to all the fetched posts.

## Features

- **Subreddit Management:** Add or remove subreddits from which to fetch posts.
- **Post Filtering:** Filter out posts based on keywords in their title or content.
- **Note Generation Limit:** Set a limit on the number of notes to generate per batch for each subreddit.
- **Duplicate Handling:** Skips posts that have already been saved as notes.
- **Organized Notes:** All Reddit notes are saved in a `Reddit` folder, with subfolders for each subreddit.
- **Subreddit Index Notes:** Each subreddit folder contains an index note (`<subreddit_name>.md`) that lists all the fetched posts for that subreddit.

## Installation

1.  **Disable Safe Mode:** Go to `Settings` -> `Community Plugins` and turn off `Safe Mode`.
2.  **Install Manually:**
    1.  Download the `main.js`, `styles.css`, and `manifest.json` files from the `dist` folder of the [latest release](link-to-releases-page).
    2.  Create a new folder named `obsidian-reddit-notes` in your vault's `.obsidian/plugins/` directory.
    3.  Copy the downloaded files into the `obsidian-reddit-notes` folder.
3.  **Enable Plugin:** Go to `Settings` -> `Community Plugins` and enable the `Reddit Notes Plugin`.

## Usage

1.  **Configure Settings:**
    1.  Go to `Settings` -> `Reddit Notes Plugin`.
    2.  **Subreddits:** Enter the subreddits you want to fetch posts from, separated by commas (e.g., `obsidian, programming, productivity`).
    3.  **Post Filters:** Enter keywords to filter out posts. Posts containing any of these keywords in their title or content will be ignored (e.g., `meme, politics, discussion`).
    4.  **Note Generation Limit:** Set the maximum number of notes to generate per batch for each subreddit (e.g., `10`).
    5.  Close the settings tab to save your changes.

2.  **Fetch Reddit Posts:**
    1.  Open the Obsidian Command Palette (`Ctrl/Cmd + P`).
    2.  Search for and select `Reddit Notes: Fetch Reddit Posts and Create Notes`.
    3.  The plugin will start fetching posts from your configured subreddits and create notes in your vault.
    4.  You will see notices indicating the progress and completion of the process.

## Note Structure

-   All notes will be saved under a `Reddit` folder in your vault.
-   Inside the `Reddit` folder, a subfolder will be created for each subreddit (e.g., `Reddit/obsidian`).
-   Each subreddit folder will contain:
    -   Individual notes for each fetched Reddit post (e.g., `Reddit - obsidian - My Awesome Post.md`).
    -   An index note named after the subreddit (e.g., `obsidian.md`) which lists all the fetched posts for that subreddit.

## Development

To set up the development environment:

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/Obsidian-Reddit-Notes.git
    cd Obsidian-Reddit-Notes
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Build the plugin:
    ```bash
    npm run build
    ```

This will compile `main.ts` and `settings.ts` into `main.js`.

## Contributing

Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
