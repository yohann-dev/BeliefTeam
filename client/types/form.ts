import { Token } from "../pages/api/tokens/tokens.api";

export interface FormData {
    tokenAddress: string;
    tweetLink: string;
    description: string;
    needs: string[];
    extraInfo: string;
    contactEmail: string;
}

export interface TokenFormProps {
    tokensList: Token[];
    form: FormData;
    onFormChange: (field: keyof FormData, value: any) => void;
    onTokenChange: (value: string) => void;
    submitAttempted: boolean;
    disabled: boolean;
} 