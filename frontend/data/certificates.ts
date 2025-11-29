import corePythonImage from '../app/about/_assets/core_python.png';
import sqlIntermediateImage from '../app/about/_assets/sql_intermediate.png';
import sqlImage from '../app/about/_assets/sql.png';
import htmlImage from '../app/about/_assets/html.png';

export const certificate_images = {
    corePython: corePythonImage,
    sqlIntermediate: sqlIntermediateImage,
    sql: sqlImage,
    html: htmlImage,
    dataScienceFoundation: 'https://media.licdn.com/dms/image/v2/D4D22AQF-HMne5fMn8w/feedshare-shrink_1280/feedshare-shrink_1280/0/1733470035181?e=1736380800&v=beta&t=y60JGLghASRMPXkV-nT5wAPLcUuYNevmrjWy94F9ITc',
    statisticFoundation: 'https://media.licdn.com/dms/image/v2/D4D22AQEwLYRm5khpGg/feedshare-shrink_1280/feedshare-shrink_1280/0/1733473868991?e=1736380800&v=beta&t=NDdzbIYwV_bHcmMGNQyCGcQ9iVzETOpzPy1qcXd5548',
    introductionToLLM: 'https://media.licdn.com/dms/image/v2/D4D22AQEmTF4diSdKcA/feedshare-shrink_1280/feedshare-shrink_1280/0/1719127334417?e=1736380800&v=beta&t=xyzZUjmKS6M2U89LwE1-DiNWpH-Q8ZAO4Zq79_bifXY',
    sqlForDataScience: 'https://codebasics.io/certificate/image/CB-82-436633',
    pythonCodeBasics: 'https://codebasics.io/certificate/image/CB-48-436633',
    lifeOfDataScientist: 'https://media.licdn.com/dms/image/v2/D4D22AQHmzP5lJUlHJw/feedshare-shrink_800/feedshare-shrink_800/0/1732464604821?e=1736985600&v=beta&t=WkUpQnyo7BZh67SHqF2KGzQf3UY1rxaku_Pud_EYd1U',
    nonTechincalSkillDataScience: 'https://media.licdn.com/dms/image/v2/D4D22AQEeWcwMumhgOA/feedshare-shrink_800/feedshare-shrink_800/0/1732517466186?e=1736985600&v=beta&t=Vk3wQ1rHcBiYJXhO4minainAUBN-lx9_KDDgKls_y7o',
    GCPM_FramingMLProbs: 'https://media.licdn.com/dms/image/v2/D4D22AQE8bsYJqSpRbw/feedshare-shrink_800/feedshare-shrink_800/0/1732617451812?e=1736985600&v=beta&t=0XnNtCq3N5DqZS6rHpOAOqBMlNGysUjWz_D2_MGge9k', 
  }
  
  const generateCertificateId = (() => {
    let id = 0;
    return () => ++id;
  })();
  
  export interface CertificateType {
    id: number;
    image: any;
    name: string;
    issuer: string;
    link: string;
    issue_date: string;
  }
  
  export const Certificates: CertificateType[] = [
    { id: generateCertificateId(), image: corePythonImage, name: 'Core Python', issuer: 'SoloLearn', link: 'https://www.sololearn.com/certificates/CT-ICA0K4WB', issue_date: '2020-12-01' },
    { id: generateCertificateId(), image: sqlIntermediateImage, name: 'SQL (Intermediate)', issuer: 'SoloLearn', link: 'https://www.sololearn.com/certificates/CC-EP9NIC1G', issue_date: '2024-02-07' },
    { id: generateCertificateId(), image: sqlImage, name: 'SQL', issuer: 'SoloLearn', link: 'https://www.sololearn.com/certificates/CC-A8TKH8KS', issue_date: '2024-01-30' },
    { id: generateCertificateId(), image: htmlImage, name: 'HTML', issuer: 'SoloLearn', link: 'https://www.sololearn.com/certificates/CT-TXLBXMOG', issue_date: '2020-11-03' },
    { id: generateCertificateId(), image: certificate_images.dataScienceFoundation, name: 'Data Science Foundation: Fundamentals', issuer: 'Linkedin', link: 'https://www.linkedin.com/learning/certificates/2525b91d27216a530128fd85f461500c702dc41801f31dd037b78aac60dce4a5', issue_date: '2024-12-06' },
    { id: generateCertificateId(), image: certificate_images.statisticFoundation, name: 'Statistic Foundation 1: Basics', issuer: 'Linkedin', link: 'https://www.linkedin.com/learning/certificates/1a484e062a1553ad8d46d3fcb8325c00838398bb0db19e014f7b89bdf0835ab5', issue_date: '2024-12-06' },
    { id: generateCertificateId(), image: certificate_images.introductionToLLM, name: 'Introduction to Large Language Models', issuer: 'Linkedin', link: 'https://www.linkedin.com/learning/certificates/648f799399c68fe7b3b1bfe5bde525617a1f356368bec3b6021711e13806646a', issue_date: '2024-06-23' },
    { id: generateCertificateId(), image: certificate_images.sqlForDataScience, name: "SQL for Data Science", issuer: "Codebasics", link: "https://codebasics.io/certificate/CB-82-436633", issue_date: '2024-12-13' },
    { id: generateCertificateId(), image: certificate_images.pythonCodeBasics, name: "Python: Beginner to Advanced For Data Professionals", issuer: "Codebasics", link: "https://codebasics.io/certificate/CB-48-436633", issue_date: '2024-12-12'},
    { id: generateCertificateId(), image: certificate_images.lifeOfDataScientist, name: "A Day In The Life of a Data Scientist", issuer: "Linkedin", link: "https://www.linkedin.com/learning/certificates/9f1871120c71bff10e0126fc4f32a5cecc4bd464a938f55fffc1c76dd6d648da", issue_date: '2024-11-24'},
    { id: generateCertificateId(), image: certificate_images.nonTechincalSkillDataScience, name: "The Non-Technical Skills of Effective Data Scientists", issuer: "Linkedin", link: "https://www.linkedin.com/learning/certificates/1574ad4fa534cd492b822432a718ae0ef125fd77a9f18d8642827fc8011ac376", issue_date: '2024-11-25'},
    { id: generateCertificateId(), image: certificate_images.GCPM_FramingMLProbs, name: "Google Cloud Professional Machine Learning Engineer Cert Prep: 1 Framing ML Problems", issuer: "Linkedin", link: "https://www.linkedin.com/learning/certificates/3f2843e743235c5196663c8c077ebf214fd473b847b074eb4bb8e2d916e4dfc6", issue_date: '2024-11-26'}
  ].sort((a, b) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime());

export const mockCertificates = [
  {
    _id: "1",
    name: "Deep Learning Specialization",
    issuer: "Coursera & deeplearning.ai",
    link: "https://www.coursera.org/specializations/deep-learning",
    issue_date: "2023-01-15",
    image_url: "https://images.unsplash.com/photo-1617791160588-241658c0f566?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    slug: "deep-learning-specialization",
    embedding: []
  },
  {
    _id: "2",
    name: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    link: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
    issue_date: "2022-11-20",
    image_url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    slug: "aws-certified-solutions-architect",
    embedding: []
  },
  {
    _id: "3",
    name: "Full Stack Development with React",
    issuer: "Meta",
    link: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
    issue_date: "2022-08-05",
    image_url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    slug: "full-stack-development-react",
    embedding: []
  },
  {
    _id: "4",
    name: "Machine Learning Engineering",
    issuer: "Stanford Online",
    link: "https://www.coursera.org/learn/machine-learning",
    issue_date: "2022-05-12",
    image_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    slug: "machine-learning-engineering",
    embedding: []
  },
  {
    _id: "5",
    name: "Google Cloud Architect",
    issuer: "Google Cloud",
    link: "https://cloud.google.com/certification/cloud-architect",
    issue_date: "2021-12-08",
    image_url: "https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    slug: "google-cloud-architect",
    embedding: []
  },
  {
    _id: "6",
    name: "Generative AI with Large Language Models",
    issuer: "DeepLearning.AI",
    link: "https://www.deeplearning.ai/courses/generative-ai-with-llms/",
    issue_date: "2023-03-22",
    image_url: "https://images.unsplash.com/photo-1677442135302-3fd3a58f2f83?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    slug: "generative-ai-llm",
    embedding: []
  }
];