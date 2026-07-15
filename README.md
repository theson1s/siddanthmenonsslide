# What Happens to Sunlight When It Reaches Earth?

An immersive six-scene Grade 9 presentation about solar radiation, surface albedo, urban heat islands and latitude. It ends with an interactive notebook-style albedo challenge.

![Presentation cover](docs/assets/slide-01.png)

## Files

- `solar-radiation-immersive-notepad-edition.pptx`: editable six-slide PowerPoint.
- `docs/`: dependency-free animated web edition for GitHub Pages with high-resolution slide images and an interactive final scene.

## Upload using the GitHub website

1. Extract the ZIP file first. Do not upload the ZIP itself.
2. On GitHub, create a new repository. A public repository is the simplest option for GitHub Pages.
3. Open the new repository and choose **Add file > Upload files**.
4. Drag in `README.md`, `solar-radiation-immersive-notepad-edition.pptx`, and the complete `docs` folder. Keep the folder structure unchanged.
5. Add a commit message such as `Add solar radiation presentation`, then click **Commit changes**.
6. Open **Settings > Pages**.
7. Under **Build and deployment**, choose **Deploy from a branch**.
8. Select the `main` branch and the `/docs` folder, then save.

GitHub will show the public Pages address after deployment. It usually follows this pattern:

`https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`

## Upload using Git

Run these commands from inside the extracted project folder:

```bash
git init
git add .
git commit -m "Add solar radiation presentation"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Then enable GitHub Pages from the `main` branch and `/docs` folder.

## Presentation controls

The published version has visible previous and next buttons. It also supports arrow keys, Page Up, Page Down, swipe gestures, autoplay with the space bar, and fullscreen with `F`.

On scene six, click Earth to enter the question field. Click a taped note to reveal its answer. Open the shaking Activity letter to complete the six-item albedo worksheet.

## Present locally

Open `docs/index.html` in a browser. For the best fullscreen experience, serve the folder with any static file server. The presentation has no external dependencies.

## Source

Content was adapted from the textbook screenshots supplied for this task. The visuals were created specifically for this presentation.
