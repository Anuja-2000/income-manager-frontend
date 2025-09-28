export interface Driver{
    id: number;
    name: string;
    licenseNumber?: string;
    nic?: string;
    contactNumber?: string;
    bankAccountNumber?: string;
    commissionPercentage?: number;
}