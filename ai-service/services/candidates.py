from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

from services.model_loader import model

def compute_embedding(text):
    return model.encode([text])[0]

def get_match_label(score):
    if score >= 80:
        return "Excellent match"
    elif score >= 60:
        return "Good match"
    elif score >= 40:
        return "Fair match"
    else:
        return "Poor match"

def safe_float(val):
    return float(np.round(val * 100, 2))

def recommend_candidates(job, seekers):
    job_text = (
        job["title"] + " " +
        job["description"] + " " +
        " ".join(job.get("requirements", []) + job.get("preferredSkills", []))
    )
    job_embedding = compute_embedding(job_text)

    results = []

    for seeker in seekers:
        skill_text = " ".join(seeker.get("skills", []))
        statement = seeker.get("statement", "")
        projects_text = " ".join([
            p.get("title", "") + " " + " ".join(p.get("technologies", []))
            for p in seeker.get("projects", [])
        ])
        experience_text = " ".join([
            e.get("title", "") + " " + e.get("description", "")
            for e in seeker.get("experiences", [])
        ])
        field_of_study = seeker.get("fieldOfStudy", "")

        seeker_embeddings = {
            "skills": compute_embedding(skill_text),
            "statement": compute_embedding(statement),
            "projects": compute_embedding(projects_text),
            "experience": compute_embedding(experience_text),
            "fieldOfStudy": compute_embedding(field_of_study),
        }

        scores = {
            "skills": cosine_similarity([seeker_embeddings["skills"]], [job_embedding])[0][0],
            "statement": cosine_similarity([seeker_embeddings["statement"]], [job_embedding])[0][0],
            "projects": cosine_similarity([seeker_embeddings["projects"]], [job_embedding])[0][0],
            "experience": cosine_similarity([seeker_embeddings["experience"]], [job_embedding])[0][0],
            "fieldOfStudy": cosine_similarity([seeker_embeddings["fieldOfStudy"]], [job_embedding])[0][0],
        }

        weighted_score = (
            scores["skills"] * 0.5 +
            scores["projects"] * 0.25 +
            scores["experience"] * 0.1 +
            scores["statement"] * 0.1 +
            scores["fieldOfStudy"] * 0.05
        )

        results.append({
            "id": seeker["id"],
            "name": seeker.get("name", ""),
            "similarity": safe_float(weighted_score),
            "matchLabel": get_match_label(weighted_score * 100),
            "details": {key: safe_float(val) for key, val in scores.items()}
        })

    return sorted(results, key=lambda x: x["similarity"], reverse=True)
