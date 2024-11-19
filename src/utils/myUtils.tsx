/* eslint-disable @typescript-eslint/no-explicit-any */
export interface MediaProps {
  deviceType: string;
}

export interface PageProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  apiResponse: any;
}
