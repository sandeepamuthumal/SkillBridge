import sys
import json
import re
import docx2txt
from PyPDF2 import PdfReader


def extract_text(file_path):
    if file_path.endswith('.pdf'):
        reader = PdfReader(file_path)
        return " ".join([page.extract_text() or '' for page in reader.pages])
    elif file_path.endswith('.docx'):
        return docx2txt.process(file_path)
    else:
        return ""


def extract_section(text, start_keywords, stop_keywords):
    lines = text.splitlines()
    section_lines = []
    capture = False

    for line in lines:
        line_clean = line.strip().lower()
        if any(k in line_clean for k in start_keywords):
            capture = True
            continue
        if capture and any(k in line_clean for k in stop_keywords):
            break
        if capture and line.strip():
            section_lines.append(line.strip())

    return "\n".join(section_lines).strip()


def extract_skills(section_text):
    skills = re.split(r",|•|·|/|-|\n", section_text)
    return list({s.strip() for s in skills if s.strip()})


def extract_education(section_text):
    edu_lines = section_text.split('\n')
    education = []
    for line in edu_lines:
        if line:
            education.append(line.strip())
    return education


def extract_experience(section_text):
    exp_lines = section_text.split('\n')
    experience = []
    for line in exp_lines:
        if line:
            experience.append(line.strip())
    return experience


def main():
    file_path = sys.argv[1]
    text = extract_text(file_path)

    skills_section = extract_section(text, ["skills", "technical skills", "tools", "technologies"],
                                      ["experience", "education", "summary", "objective", "projects"])

    education_section = extract_section(text, ["education", "academic background", "qualifications"],
                                        ["experience", "skills", "projects", "summary"])

    experience_section = extract_section(text, ["experience", "professional experience", "work history"],
                                         ["education", "skills", "projects", "summary"])

    skills = extract_skills(skills_section)
    education = extract_education(education_section)
    experience = extract_experience(experience_section)

    result = {
        "skills": skills,
        "education": education,
        "experience": experience
    }

    print(json.dumps(result))


if __name__ == "__main__":
    main()
