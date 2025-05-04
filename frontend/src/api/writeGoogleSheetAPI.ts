const API_URL = 'http://localhost:3000'

type UserResponse = {
    success: boolean;
    message?: string;
    // Add other fields if needed
  };
  
  export const writeGoogleSheetAPI = async (params: any): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/writeSheet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params) // You can add data here
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const sheetRes: UserResponse = await response.json();
  
      if (sheetRes.success) {
        console.log("Sheet updated successfully:", sheetRes.message);
        return true;
      } else {
        console.warn("Sheet update failed:", sheetRes.message);
        return false;
      }
  
    } catch (error) {
      console.error("Connecting to backend failed:", error);
      return false;
    }
  };