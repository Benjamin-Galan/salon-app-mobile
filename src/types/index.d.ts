export interface Appointment {
    id: number;
    date: string;
    time: string;
    duration: number;
    subtotal: number;
    discount: number;
    total: number;
    code: string;
    notes: string | null;
    active: boolean;
    status: string;
    user_id: number;
    employee_id: number;
    created_at: string;
    updated_at: string;
    items: AppointmentItem[];
    user: User;
    employee: Employee;
}