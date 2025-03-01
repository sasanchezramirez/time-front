export interface TimeComparisonRequest {
    user_id?: number;
    is_logged: boolean;
    v_1: number;
    v_2: number;
    t_ref: number;
}

export interface TimeComparisonData {
    t_1: number;
    t_2: number;
    delta_t: number;
}

export interface ApiResponse<T> {
    apiCode: string;
    data: T;
    message: string;
    status: boolean;
}
