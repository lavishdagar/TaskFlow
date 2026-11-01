import { useParams } from 'react-router-dom'

export default function ProjectDetails() {
    const { projectId } = useParams();
    return (
        <div>
            <h1>Project Details</h1>
            <h1>Project ID: {projectId}</h1>
        </div>
    )
}