import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Mock projects data
const projects = [
  {
    id: '1',
    title: 'Residential Building Design',
    description: 'Modern residential building with 24 units',
    client: 'ABC Development Ltd',
    status: 'in-progress',
    startDate: '2023-01-15',
    endDate: '2023-08-30',
    budget: 2500000,
    location: 'Lagos, Nigeria',
    thumbnail: '/images/projects/residential-building.jpg',
    team: [
      { id: '1', name: 'John Doe', role: 'Project Manager' },
      { id: '2', name: 'Jane Smith', role: 'Architect' },
    ],
  },
  {
    id: '2',
    title: 'Commercial Office Complex',
    description: 'High-rise office building with modern amenities',
    client: 'XYZ Corporate Holdings',
    status: 'completed',
    startDate: '2022-05-10',
    endDate: '2023-03-20',
    budget: 5000000,
    location: 'Abuja, Nigeria',
    thumbnail: '/images/projects/office-complex.jpg',
    team: [
      { id: '1', name: 'John Doe', role: 'Project Manager' },
      { id: '3', name: 'Robert Johnson', role: 'Structural Engineer' },
    ],
  },
  {
    id: '3',
    title: 'Shopping Mall Renovation',
    description: 'Renovation and expansion of existing shopping mall',
    client: 'Retail Ventures Inc',
    status: 'planning',
    startDate: '2023-09-01',
    endDate: '2024-06-30',
    budget: 3800000,
    location: 'Port Harcourt, Nigeria',
    thumbnail: '/images/projects/shopping-mall.jpg',
    team: [
      { id: '2', name: 'Jane Smith', role: 'Architect' },
      { id: '4', name: 'Michael Brown', role: 'Interior Designer' },
    ],
  },
];

// Get all projects
router.get('/', (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Projects retrieved successfully',
      data: projects,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Get project by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const project = projects.find((p) => p.id === id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Project retrieved successfully',
      data: project,
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Create new project
router.post('/', (req, res) => {
  try {
    const { title, description, client, status, startDate, endDate, budget, location } = req.body;

    if (!title || !description || !client) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing',
      });
    }

    const newProject = {
      id: uuidv4(),
      title,
      description,
      client,
      status: status || 'planning',
      startDate,
      endDate,
      budget,
      location,
      thumbnail: '/images/projects/default-project.jpg',
      team: [],
    };

    // In a real app, we would save to database
    // For mock purposes, we'll just log it
    console.log('New project created:', newProject);

    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: newProject,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;