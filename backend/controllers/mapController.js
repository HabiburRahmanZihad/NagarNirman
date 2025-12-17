// Map Controller for Division/District Statistics
import {
  getReportStatsByDivision,
  getReportStatsByDistrict,
  getAllDivisionsStats,
} from '../models/Report.js';

// Get all divisions with statistics
export const getDivisionsStats = async (req, res) => {
  try {
    const stats = await getAllDivisionsStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error getting divisions stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching divisions statistics',
      error: error.message,
    });
  }
};



// Get statistics for a specific division
export const getDivisionStats = async (req, res) => {
  try {
    const { division } = req.params;

    if (!division) {
      return res.status(400).json({
        success: false,
        message: 'Division name is required',
      });
    }

    const stats = await getReportStatsByDivision(division);

    res.status(200).json({
      success: true,
      division,
      districts: stats,
    });
  } catch (error) {
    console.error('Error getting division stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching division statistics',
      error: error.message,
    });
  }
};



// Get statistics for a specific district
export const getDistrictStats = async (req, res) => {
  try {
    const { district } = req.params;

    if (!district) {
      return res.status(400).json({
        success: false,
        message: 'District name is required',
      });
    }

    const stats = await getReportStatsByDistrict(district);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error getting district stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching district statistics',
      error: error.message,
    });
  }
};
