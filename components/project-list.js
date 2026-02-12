import { projects } from "../data/projects.js";

class ProjectList extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.render();
	}

	getIconPath() {
		return "./assets/icons";
	}

	getImagePath(imagePath) {
		if (!imagePath) {
			return "./assets/default-project.png";
		}
		return imagePath;
	}

	createProjectBox(project) {
		const iconPath = this.getIconPath();
		const imagePath = this.getImagePath(project.image);

		return `
			<div class="project-box">
				<div class="project-image">
					<img src="${imagePath}" alt="${project.title}" width="250" height="200" loading="lazy">
				</div>
				<div class="project-content">
					<div class="title-row">
						<h2>${project.emoji} ${project.title}</h2>
						<ul>
							<li>
								<a target="_blank" href="${project.github}"
									onclick="event.stopPropagation()"
									aria-label="View ${project.title} on GitHub">
									<svg class="link-icon" aria-hidden="true">
										<use href="${iconPath}/github.svg#icon"></use>
									</svg>
								</a>
							</li>
							${
								project.website
									? `
								<li>
									<a target="_blank" href="${project.website}" onclick="event.stopPropagation()"
										aria-label="Visit ${project.title} website">
										<svg class="link-icon" aria-hidden="true">
											<use href="${iconPath}/web.svg#icon"></use>
										</svg>
									</a>
								</li>
							`
									: ""
							}
							${
								project.youtube
									? `
								<li>
									<a target="_blank" href="${project.youtube}" onclick="event.stopPropagation()"
										aria-label="Watch ${project.title} demo on YouTube">
										<svg class="link-icon" aria-hidden="true">
											<use href="${iconPath}/youtube.svg#icon"></use>
										</svg>
									</a>
								</li>
							`
									: ""
							}
						</ul>
					</div>
					<p class="explanation">${project.description}</p>
					<p class="tech-stack">⚙️ ${project.techStack}</p>
				</div>
			</div>
		`;
	}

	render() {
		this.innerHTML = projects.map((project) => this.createProjectBox(project)).join("");
	}
}

export default function registerProjectList() {
	customElements.define("project-list", ProjectList);
}
