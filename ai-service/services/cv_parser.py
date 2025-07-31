import re
from docx import Document
from PyPDF2 import PdfReader
from typing import List, Dict, Optional
from dateutil import parser
import logging

# Set up logging for debugging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def extract_text(file_path: str) -> str:
    """Extract text from PDF or DOCX files."""
    try:
        if file_path.endswith('.pdf'):
            reader = PdfReader(file_path)
            return "\n".join([page.extract_text() or '' for page in reader.pages])
        elif file_path.endswith('.docx'):
            doc = Document(file_path)
            return "\n".join([para.text for para in doc.paragraphs])
        return ""
    except Exception as e:
        logger.error(f"Error extracting text from {file_path}: {e}")
        return ""

def find_section_boundaries(text: str) -> Dict[str, int]:
    """Find the line numbers where each section starts."""
    lines = text.splitlines()
    boundaries = {}
    
    section_patterns = {
        'profile': r'^(profile|summary|objective|about)\s*$',
        'skills': r'^(skills|technical skills|technologies|tools|competencies)\s*$',
        'experience': r'^(experience|work experience|employment|work history|professional experience)\s*$',
        'education': r'^(education|academic background|qualifications)\s*$',
        'projects': r'^(projects|personal projects|key projects)\s*$',
        'languages': r'^(languages|language skills)\s*$',
        'contact': r'^(contact|contact details|contact information)\s*$'
    }
    
    for i, line in enumerate(lines):
        clean_line = line.strip().lower()
        if not clean_line:
            continue
            
        for section, pattern in section_patterns.items():
            if re.match(pattern, clean_line, re.IGNORECASE):
                boundaries[section] = i
                logger.info(f"Found {section} section at line {i}: {line.strip()}")
                break
    
    return boundaries

def extract_section_content(text: str, section_name: str, boundaries: Dict[str, int]) -> str:
    """Extract content for a specific section based on boundaries."""
    lines = text.splitlines()
    
    if section_name not in boundaries:
        return ""
    
    start_line = boundaries[section_name] + 1  # Skip the header line
    
    # Find the next section boundary
    next_sections = [line_num for section, line_num in boundaries.items() 
                    if line_num > boundaries[section_name]]
    end_line = min(next_sections) if next_sections else len(lines)
    
    # Extract content between boundaries
    section_lines = []
    for i in range(start_line, end_line):
        line = lines[i].strip()
        if line:  # Skip empty lines
            section_lines.append(line)
    
    return "\n".join(section_lines)

def extract_skills(text: str) -> List[str]:
    """Extract skills from the skills section."""
    boundaries = find_section_boundaries(text)
    skills_content = extract_section_content(text, 'skills', boundaries)
    
    if not skills_content:
        return []
    
    # Clean up the skills content
    skills_text = skills_content.replace('•', ',').replace('·', ',')
    
    # Split by common delimiters
    skills = []
    for delimiter in [',', '\n', '|', ';']:
        skills_text = skills_text.replace(delimiter, '|||')
    
    raw_skills = skills_text.split('|||')
    
    # Clean and filter skills
    for skill in raw_skills:
        clean_skill = skill.strip()
        if clean_skill and len(clean_skill) > 1 and len(clean_skill) < 50:
            # Filter out common non-skill words
            exclude_words = ['skills', 'technologies', 'tools', 'experience', 'years', 'proficient']
            if not any(word in clean_skill.lower() for word in exclude_words):
                skills.append(clean_skill)
    
    return list(set(skills))  # Remove duplicates

def extract_education(text: str) -> List[Dict]:
    """Extract education information with improved filtering."""
    boundaries = find_section_boundaries(text)
    education_content = extract_section_content(text, 'education', boundaries)
    
    if not education_content:
        return []
    
    educations = []
    lines = [line.strip() for line in education_content.split('\n') if line.strip()]
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # More specific degree patterns - must start with actual degree types
        degree_pattern = r'^(bachelor|master|diploma|certificate|phd|doctorate|b\.?s\.?c?\.?|m\.?s\.?c?\.?|b\.?a\.?|m\.?a\.?|b\.?tech|m\.?tech|b\.?e\.?|m\.?e\.?)'
        
        # Exclude lines that are clearly not degrees
        exclude_patterns = [
            r'^relevant\s+coursework',
            r'^coursework',
            r'^courses?:',
            r'^gpa:?',
            r'^grade:?',
            r'^activities',
            r'^honors?',
            r'^awards?',
            r'^achievements?'
        ]
        
        # Check if line matches degree pattern and doesn't match exclude patterns
        is_degree = re.search(degree_pattern, line, re.IGNORECASE)
        is_excluded = any(re.search(pattern, line, re.IGNORECASE) for pattern in exclude_patterns)
        
        if is_degree and not is_excluded:
            education_entry = {
                "degree": line,
                "fieldOfStudy": "",
                "university": "",
                "startYear": None,
                "endYear": None,
                "currentlyStudying": False,
                "gpa": None
            }
            
            # Extract field of study from degree line if possible
            # Pattern: "Bachelor of [Field] in [Specialization]" or "Bachelor in [Field]"
            field_match = re.search(r'(?:bachelor|master|diploma)\s+(?:of\s+)?(?:science\s+)?(?:arts\s+)?(?:in\s+)?([^,\n]+?)(?:\s+in\s+([^,\n]+))?$', line, re.IGNORECASE)
            
            if field_match:
                education_entry["fieldOfStudy"] = field_match.group(1).strip()
                if field_match.group(2):
                    education_entry["university"] = field_match.group(2).strip()
            
            # Extract start and end years
            year_pattern = r'\d{4}'
            years = re.findall(year_pattern, line)
            if years:
                education_entry["startYear"] = int(years[0])
                if len(years) > 1:
                    education_entry["endYear"] = int(years[1])
            
            educations.append(education_entry)
        
        i += 1
    
    return educations

def extract_experience(text: str) -> List[Dict]:
    """Extract work experience information."""
    boundaries = find_section_boundaries(text)
    experience_content = extract_section_content(text, 'experience', boundaries)
    
    if not experience_content:
        return []
    
    experiences = []
    lines = experience_content.split('\n')
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # Skip bullet points and descriptions
        if line.startswith('•') or line.startswith('-') or line.startswith('*'):
            i += 1
            continue
        
        # Look for job title (usually a standalone line that's not a company or date)
        if line and not re.search(r'\d{4}', line) and len(line) > 3:
            # This might be a job title
            potential_title = line
            
            # Look ahead for company and dates
            company = ""
            start_date = None
            end_date = None
            description_lines = []
            
            for j in range(i + 1, min(i + 10, len(lines))):
                if j >= len(lines):
                    break
                    
                next_line = lines[j].strip()
                
                # Check for date patterns
                date_patterns = [
                    r'(\w+\s+\d{4})\s*-\s*(\w+\s+\d{4})',  # Jun 2020 - Dec 2021
                    r'(\d{4})\s*-\s*(\d{4})',  # 2020 - 2021
                    r'(\d{1,2}/\d{4})\s*-\s*(\d{1,2}/\d{4})'  # 06/2020 - 12/2021
                ]
                
                date_found = False
                for pattern in date_patterns:
                    date_match = re.search(pattern, next_line)
                    if date_match:
                        start_date = convert_to_date(date_match.group(1))
                        end_date = convert_to_date(date_match.group(2))
                        date_found = True
                        break
                
                # If no date found and no company yet, this might be the company
                if not date_found and not company and not next_line.startswith('•'):
                    company = next_line
                
                # Collect description lines (bullet points)
                if next_line.startswith('•') or next_line.startswith('-') or next_line.startswith('*'):
                    description_lines.append(next_line.lstrip('•-* '))
                
                # Stop if we hit another job title or section
                if (date_found and company) or (j > i + 5 and not next_line.startswith('•')):
                    break
            
            # Create experience entry if we have minimum required info
            if company or start_date:
                experience_entry = {
                    "title": potential_title,
                    "company": company,
                    "startDate": start_date,
                    "endDate": end_date,
                    "currentlyWorking": end_date is None and start_date is not None,
                    "description": ". ".join(description_lines) if description_lines else ""
                }
                experiences.append(experience_entry)
                logger.info(f"Found experience: {potential_title} at {company}")
        
        i += 1
    
    return experiences

def extract_projects(text: str) -> List[Dict]:
    """Extract project information with improved accuracy."""
    boundaries = find_section_boundaries(text)
    projects_content = extract_section_content(text, 'projects', boundaries)
    
    if not projects_content:
        return []
    
    projects = []
    lines = [line.strip() for line in projects_content.split('\n') if line.strip()]
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # More sophisticated project title detection
        is_potential_title = (
            line and 
            not line.startswith(('•', '-', '*')) and  # Not a bullet point
            not line.startswith(('Technologies:', 'GitHub:', 'URL:', 'Demo:', 'Live:', 'Link:')) and  # Not metadata
            not re.match(r'^https?://', line) and  # Not a URL
            not re.match(r'^github\.com/', line) and  # Not a GitHub link
            not re.match(r'^[\w\-]+\.[\w\-]+\.com', line) and  # Not a domain
            len(line.split()) <= 6 and  # Reasonable title length
            len(line) <= 80  # Not too long to be a description
        )
        
        if is_potential_title:
            # Check if this looks like a description line by examining context
            is_description = False
            
            # Check if the previous line was a project title we already processed
            if i > 0 and len(projects) > 0:
                prev_line = lines[i-1]
                # If previous line was short and this line starts with lowercase or continues a sentence
                if (len(prev_line.split()) <= 4 and 
                    (line[0].islower() or 
                     any(line.startswith(word) for word in ['built', 'developed', 'created', 'designed', 'implemented', 'A ', 'An ', 'The ']))):
                    is_description = True
            
            # Skip if it's likely a description
            if is_description:
                i += 1
                continue
            
            project_title = line
            description_parts = []
            technologies = []
            github_url = ""
            project_url = ""
            
            # Look ahead for project details
            j = i + 1
            while j < len(lines) and j < i + 10:  # Look up to 10 lines ahead
                next_line = lines[j]
                
                # Check for explicit metadata lines
                if next_line.startswith('Technologies:'):
                    tech_text = next_line.replace('Technologies:', '').strip()
                    technologies = [tech.strip() for tech in re.split(r'[,;|]', tech_text) if tech.strip()]
                    j += 1
                    continue
                
                if next_line.startswith(('GitHub:', 'Github:')):
                    github_url = next_line.split(':', 1)[1].strip()
                    if not github_url.startswith('http'):
                        github_url = 'https://' + github_url
                    j += 1
                    continue
                
                if next_line.startswith(('URL:', 'Demo:', 'Live:', 'Link:')):
                    project_url = next_line.split(':', 1)[1].strip()
                    if not project_url.startswith('http') and '.' in project_url:
                        project_url = 'https://' + project_url
                    j += 1
                    continue
                
                # Check for URLs in the line
                github_match = re.search(r'github\.com/[\w\-./]+', next_line)
                if github_match:
                    github_url = 'https://' + github_match.group(0)
                    j += 1
                    continue
                
                url_match = re.search(r'(https?://[\w\-./]+|[\w\-]+\.[\w\-]+\.com)', next_line)
                if url_match and 'github.com' not in url_match.group(0):
                    project_url = url_match.group(0)
                    if not project_url.startswith('http'):
                        project_url = 'https://' + project_url
                    j += 1
                    continue
                
                # Check if this might be another project title
                next_is_potential_title = (
                    len(next_line.split()) <= 6 and
                    len(next_line) <= 80 and
                    not next_line.startswith(('•', '-', '*')) and
                    not next_line[0].islower() and
                    not any(next_line.startswith(word) for word in ['built', 'developed', 'created', 'designed', 'implemented', 'A ', 'An ', 'The '])
                )
                
                # If we find another potential project title, stop processing this project
                if next_is_potential_title and j > i + 1:
                    break
                
                # Otherwise, treat it as description
                description_parts.append(next_line)
                j += 1
            
            # Combine description parts
            description = " ".join(description_parts).strip()
            
            # Extract technologies from description if not found in metadata
            if not technologies and description:
                tech_patterns = [
                    r'\b(React|Angular|Vue\.js|Vue|Node\.js|Express|Django|Flask|Spring|Laravel)\b',
                    r'\b(JavaScript|TypeScript|Python|Java|C\+\+|C#|PHP|Ruby|Go|Rust)\b',
                    r'\b(MongoDB|MySQL|PostgreSQL|Redis|SQLite|Firebase)\b',
                    r'\b(HTML|CSS|Bootstrap|Tailwind|SASS|SCSS|Material-UI)\b',
                    r'\b(Git|Docker|AWS|Azure|GCP|Kubernetes|Heroku)\b',
                    r'\b(JWT|OAuth|REST|GraphQL|API)\b'
                ]
                
                for pattern in tech_patterns:
                    matches = re.findall(pattern, description, re.IGNORECASE)
                    for match in matches:
                        if match not in technologies:
                            technologies.append(match)
            
            # Only add project if it has meaningful content
            if project_title and (description or technologies or github_url or project_url):
                project_entry = {
                    "title": project_title,
                    "description": description,
                    "technologies": technologies,
                    "projectUrl": project_url,
                    "githubUrl": github_url,
                    "startDate": None,
                    "endDate": None
                }
                
                projects.append(project_entry)
                logger.info(f"Found project: {project_title}")
                
                # Skip the lines we've processed
                i = j
            else:
                i += 1
        else:
            i += 1
    
    return projects

def extract_social_links(text: str) -> Dict[str, str]:
    """Extract social media and portfolio links."""
    linkedin_match = re.search(r'linkedin\.com/in/[\w\-]+', text, re.IGNORECASE)
    github_match = re.search(r'github\.com/[\w\-]+', text, re.IGNORECASE)
    
    # Look for portfolio URLs (excluding common platforms)
    portfolio_pattern = r'(https?://[\w\-./]+|[\w\-]+\.[\w\-]+\.com)'
    portfolio_matches = re.findall(portfolio_pattern, text, re.IGNORECASE)
    
    portfolio_url = ""
    for match in portfolio_matches:
        if not any(platform in match.lower() for platform in ['linkedin', 'github', 'gmail', 'email']):
            portfolio_url = match
            break
    
    return {
        "linkedin": linkedin_match.group(0) if linkedin_match else "",
        "github": github_match.group(0) if github_match else "",
        "portfolio": portfolio_url
    }

def convert_to_date(date_text: str) -> Optional[str]:
    """Convert various date formats to YYYY-MM-DD."""
    if not date_text:
        return None
    
    try:
        # Handle common formats
        date_text = date_text.strip()
        
        # Try parsing with dateutil
        parsed_date = parser.parse(date_text, fuzzy=True)
        return parsed_date.strftime("%Y-%m-%d")
    except Exception as e:
        logger.warning(f"Could not parse date: {date_text}, error: {e}")
        return None

def extract_contact_info(text: str) -> Dict[str, str]:
    """Extract contact information."""
    contact_info = {
        "email": "",
        "phone": "",
        "address": "",
        "name": ""
    }
    
    # Extract email
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    if email_match:
        contact_info["email"] = email_match.group(0)
    
    # Extract phone (various formats)
    phone_patterns = [
        r'\+\d{1,3}\s?\d{2}\s?\d{3}\s?\d{4}',  # +94 71 123 4567
        r'\(\d{3}\)\s?\d{3}-\d{4}',  # (123) 456-7890
        r'\d{3}-\d{3}-\d{4}',  # 123-456-7890
        r'\d{10,}'  # 1234567890
    ]
    
    for pattern in phone_patterns:
        phone_match = re.search(pattern, text)
        if phone_match:
            contact_info["phone"] = phone_match.group(0)
            break
    
    # Extract name (usually at the top)
    lines = text.split('\n')
    for line in lines[:5]:  # Check first 5 lines
        clean_line = line.strip()
        if (clean_line and len(clean_line.split()) <= 4 and 
            not re.search(r'[@\d]', clean_line) and
            not clean_line.lower() in ['software engineer', 'developer', 'profile', 'contact']):
            contact_info["name"] = clean_line
            break
    
    # Extract address (look for city, country patterns)
    address_match = re.search(r'([A-Za-z\s]+,\s*[A-Za-z\s]+)', text)
    if address_match:
        contact_info["address"] = address_match.group(0)
    
    return contact_info

def parse_cv(file_path: str) -> Dict:
    """Main function to parse CV and extract all information."""
    try:
        text = extract_text(file_path)
        if not text:
            logger.error("No text extracted from file")
            return {}
        
        logger.info("Starting CV parsing...")
        
        # Extract all sections
        contact_info = extract_contact_info(text)
        skills = extract_skills(text)
        educations = extract_education(text)
        experiences = extract_experience(text)
        projects = extract_projects(text)
        social_links = extract_social_links(text)
        
        result = {
            "success": True,
            "message": "CV parsed successfully",
            "data" :{
                "contactInfo": contact_info,
                "skills": skills,
                "educations": educations,
                "experiences": experiences,
                "projects": projects,
                "socialLinks": social_links
            }
        }
        
        logger.info(f"Parsing completed. Found: {len(skills)} skills, {len(educations)} education entries, {len(experiences)} experiences, {len(projects)} projects")
        
        return result
        
    except Exception as e:
        logger.error(f"Error parsing CV: {e}")
        return {
            "success": False,
            "message": str(e)
        }

# Example usage and testing function
def test_parser():
    """Test function to validate the parser."""
    # This would be called with your actual file path
    # result = parse_cv("path/to/your/cv.docx")
    # print(json.dumps(result, indent=2))
    pass

if __name__ == "__main__":
    test_parser()