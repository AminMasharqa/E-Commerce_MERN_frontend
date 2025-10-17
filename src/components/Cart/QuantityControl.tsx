import { Box, IconButton, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useState, useCallback } from "react";

interface QuantityControlProps {
    value: number;
    min?: number;
    max?: number;
    onChange: (newValue: number) => void;
}

const QuantityControl = ({ value, min = 1, max = 99, onChange }: QuantityControlProps) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleChange = useCallback((newValue: number) => {
        if (newValue < min || newValue > max) return;
        
        setIsAnimating(true);
        onChange(newValue);
        
        setTimeout(() => setIsAnimating(false), 150);
    }, [min, max, onChange]);

    const canDecrease = value > min;
    const canIncrease = value < max;

    return (
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1px solid #E5E7EB',
                borderRadius: '10px',
                overflow: 'hidden',
                bgcolor: '#FFFFFF',
            }}
        >
            <IconButton
                onClick={() => handleChange(value - 1)}
                disabled={!canDecrease}
                aria-label="Decrease quantity"
                sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 0,
                    '&:hover': {
                        bgcolor: '#F9FAFB',
                    },
                    '&:active': {
                        bgcolor: '#F3F4F6',
                        transform: 'scale(0.95)',
                    },
                    '&.Mui-disabled': {
                        opacity: 0.3,
                    },
                    transition: 'all 150ms ease',
                }}
            >
                <RemoveIcon sx={{ fontSize: 18 }} />
            </IconButton>

            <Box
                sx={{
                    width: 60,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderLeft: '1px solid #E5E7EB',
                    borderRight: '1px solid #E5E7EB',
                }}
            >
                <Typography
                    sx={{
                        fontSize: '15px',
                        fontWeight: 500,
                        color: '#111827',
                        fontVariantNumeric: 'tabular-nums',
                        transition: 'transform 150ms ease',
                        transform: isAnimating ? 'scale(1.2)' : 'scale(1)',
                    }}
                >
                    {value}
                </Typography>
            </Box>

            <IconButton
                onClick={() => handleChange(value + 1)}
                disabled={!canIncrease}
                aria-label="Increase quantity"
                sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 0,
                    '&:hover': {
                        bgcolor: '#F9FAFB',
                    },
                    '&:active': {
                        bgcolor: '#F3F4F6',
                        transform: 'scale(0.95)',
                    },
                    '&.Mui-disabled': {
                        opacity: 0.3,
                    },
                    transition: 'all 150ms ease',
                }}
            >
                <AddIcon sx={{ fontSize: 18 }} />
            </IconButton>
        </Box>
    );
};

export default QuantityControl;


