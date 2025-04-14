import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import APIService from '../services/api-service';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Import default styles
import { setCurrentPage, setP2PEscrowDetails } from '../redux/reducers/pay';

// Custom CSS to style PhoneInput like MUI TextField
const phoneInputStyles = `
  .PhoneInput {
    display: flex;
    align-items: center;
    border: 1px solid #ced4da; /* Match MUI TextField border color */
    border-radius: 8px; /* Match borderRadius: 2 from TextField */
    padding: 10px 14px; /* Match TextField padding */
    background-color: #fff;
    transition: border-color 0.2s;
  }

  .PhoneInput:hover {
    border-color: #1976d3; /* Match TextField hover state */
  }

  .PhoneInput:focus-within {
    border-color: #1976d3; /* Match TextField focused state */
    border-width: 2px;
    padding: 9px 13px; /* Adjust padding to account for thicker border */
  }

  .PhoneInputInput {
    border: none;
    outline: none;
    font-size: 16px; /* Match TextField font size */
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif; /* Match MUI font */
    width: 100%;
    background: transparent;
  }

  .PhoneInputCountry {
    margin-right: 8px;
  }

  .PhoneInputCountrySelectArrow {
    margin-left: 4px;
  }

  /* Optional: Style the label to float like MUI TextField */
  .PhoneInputWrapper {
    position: relative;
  }

  .PhoneInputLabel {
    position: absolute;
    top: -8px;
    left: 12px;
    background: #fff;
    padding: 0 4px;
    font-size: 12px;
    color: #666;
  }
`;

// Inject the styles into the document
const styleSheet = document.createElement('style');
styleSheet.innerText = phoneInputStyles;
document.head.appendChild(styleSheet);

export default function RequiredFields(): React.JSX.Element {
    const { payId, clickedId } = useSelector((state: RootState) => state.pay);
    const { p2pEscrowDetails } = useSelector((state: RootState) => state.pay);
    const dispatch = useDispatch();
    const [formValues, setFormValues] = useState<{ [key: string]: string }>({});

    // Handle input change for text fields and phone number
    const handleInputChange = (fieldName: string, value: string) => {
        setFormValues((prev) => ({ ...prev, [fieldName]: value }));
    };

    // Handle form submission
    const handleConfirm = async () => {
        // console.log('Clicked ID >>>', clickedId);
        try {
            const fields = p2pEscrowDetails?.fields || [];
            const userDetails: { [key: string]: string } = {};

            fields.forEach((field: { name: string }) => {
                const fieldName = field.name;
                const fieldValue = formValues[fieldName] || '';
                userDetails[fieldName] = fieldValue;
            });

            const updateUserPayload = {
                call_type: 'update_profile',
                pay_id: payId,
                users_details: userDetails,
            };

            const respo = await APIService.updateUser(updateUserPayload);
            console.log('Updated:', respo);

            if (respo.data?.status?.toLowerCase()?.includes("success")) {
                const p2pEscrowPayload = {
                    call_type: "p2p_vendors_escrow",
                    ip: "192.168.0.0",
                    pay_id: payId,
                    vendor_id: clickedId,
                };
                const resp = await APIService.p2pVendorsEscrow(p2pEscrowPayload);
                console.log("API Response From Vendor's Escrow", resp.data);
                dispatch(setP2PEscrowDetails(resp.data));
                dispatch(setCurrentPage("escrow-page"));
            }
        } catch (error) {
            console.log('Submit Error:', error);
        }
    };

    // Render input fields dynamically
    const renderField = (field: { name: string; title: string; type: string }) => {
        const { name, title, type } = field;

        if (name === 'phone_number') {
            return (
                <Box key={name} className="PhoneInputWrapper">
                    <label className="PhoneInputLabel">{title}</label>
                    <PhoneInput
                        placeholder=""
                        value={formValues[name] || ''}
                        onChange={(value: string | undefined) => handleInputChange(name, value || '')}
                        defaultCountry="US"
                        international
                        countryCallingCodeEditable={false}
                        style={{ width: '100%' }}
                    />
                </Box>
            );
        }

        return (
            <TextField
                key={name}
                label={title}
                type={type}
                variant="outlined"
                fullWidth
                required
                value={formValues[name] || ''}
                onChange={(e) => handleInputChange(name, e.target.value)}
                InputProps={{ sx: { borderRadius: 2 } }}
            />
        );
    };

    return (
        <>
            <form action="">
                <Box display="flex" flexDirection="column" gap={2} pt={2}>
                    {p2pEscrowDetails?.fields?.length > 0 ? (
                        p2pEscrowDetails.fields.map((field: { name: string; title: string; type: string }) =>
                            renderField(field)
                        )
                    ) : (
                        <Box>No required fields to display.</Box>
                    )}
                </Box>
            </form>
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                pt={3}
            >
                <Button
                    variant="contained"
                    onClick={handleConfirm}
                    sx={{
                        width: '100%',
                        p: 2,
                        borderRadius: 2,
                        ':hover': { background: '#0C0E1D' },
                        bgcolor: '#009FDD',
                    }}
                >
                    Update & Continue
                </Button>
            </Box>
        </>
    );
}


