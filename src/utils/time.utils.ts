/**
 * Time Utilities
 * Helper functions for time calculations and formatting
 */

/**
 * Calculate duration between two datetime strings
 * @param startTime - ISO datetime string (waktu_mulai_pengerjaan)
 * @param endTime - ISO datetime string (waktu_akhir_pengerjaan)
 * @returns Formatted duration string (e.g., "1 jam 30 menit")
 */
export function calculateExamDuration(startTime: string, endTime: string): string {
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    // Calculate difference in milliseconds
    const diffMs = end.getTime() - start.getTime();
    
    // Convert to minutes
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    // Calculate hours and remaining minutes
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    // Format output
    if (hours > 0 && minutes > 0) {
      return `${hours} jam ${minutes} menit`;
    } else if (hours > 0) {
      return `${hours} jam`;
    } else {
      return `${minutes} menit`;
    }
  } catch (error) {
    // Error calculating exam duration
    return '1 jam 30 menit'; // fallback default
  }
}

/**
 * Format remaining time from seconds to readable format
 * @param seconds - Remaining time in seconds
 * @returns Formatted time string (e.g., "1:30:45")
 */
export function formatRemainingTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

/**
 * Check if current time is within exam time window
 * @param startTime - ISO datetime string (waktu_mulai_pengerjaan)
 * @param endTime - ISO datetime string (waktu_akhir_pengerjaan)
 * @returns Object with status and message
 */
export function checkExamTimeWindow(startTime: string, endTime: string): {
  isValid: boolean;
  status: 'not_started' | 'active' | 'ended';
  message: string;
} {
  try {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (now < start) {
      return {
        isValid: false,
        status: 'not_started',
        message: 'Ujian belum dimulai'
      };
    } else if (now > end) {
      return {
        isValid: false,
        status: 'ended',
        message: 'Ujian sudah berakhir'
      };
    } else {
      return {
        isValid: true,
        status: 'active',
        message: 'Ujian sedang berlangsung'
      };
    }
  } catch (error) {
    // Error checking exam time window
    return {
      isValid: false,
      status: 'ended',
      message: 'Error validating exam time'
    };
  }
}