import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import APIService from '../services/api-service';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setCurrentPage } from '../redux/reducers/pay';

export default function RequiredFields(): React.JSX.Element {
    const { payId } = useSelector((state: RootState) => state.pay);
    const { p2pEscrowDetails } = useSelector((state: RootState) => state.pay);
    const dispatch = useDispatch();

    // State to store form values dynamically
    const [formValues, setFormValues] = useState<{ [key: string]: string }>({});
    const [countryCode, setCountryCode] = useState<string>('+1');

   // Handle input change for text fields
   const handleInputChange = (fieldName: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Handle country code change with correct typing
  const handleCountryCodeChange = (event: SelectChangeEvent<string>) => {
    setCountryCode(event.target.value as string);
  };

    // Handle form submission
    const handleConfirm = async () => {
        try {
            const fields = p2pEscrowDetails?.fields || [];
            for (const field of fields) {
                const fieldName = field.name;
                let fieldValue = formValues[fieldName] || '';

                // If the field is phone_number, prepend the country code
                if (fieldName === 'phone_number' && fieldValue) {
                    fieldValue = `${countryCode}${fieldValue}`; // Merges country code and phone number
                }

                const updateUserPayload = {
                    call_type: 'update_profile',
                    pay_id: payId,
                    field: fieldName,
                    value: fieldValue,
                };

                const respo = await APIService.updateUser(updateUserPayload);
                console.log('Payload Sent', updateUserPayload);
                console.log(`Updated ${fieldName}:`, respo);
                if (respo.data.status === 'success') {
                    dispatch(setCurrentPage("escrow-page"));

                }
            }
        } catch (error) {
            console.log('Submit Error:', error);
        }
    };

    // Dynamically render fields based on API response
    const renderField = (field: { name: string; title: string; type: string }) => {
        const { name, title, type } = field;

        if (name === 'phone_number') {
            return (
                <Box key={name} display="flex" gap={1}>
                    <Select
                        value={countryCode}
                        onChange={handleCountryCodeChange}
                        sx={{ borderRadius: 2, minWidth: 100 }}
                        required
                    >
                        <MenuItem value="+1">+1 (US)</MenuItem>
                        <MenuItem value="+234">+234 (NG)</MenuItem>
                        <MenuItem value="+44">+44 (UK)</MenuItem>
                        <MenuItem value="+91">+91 (IN)</MenuItem>
                        <MenuItem value="+81">+81 (JP)</MenuItem>
                        <MenuItem value="+1CA">+1 (CA)</MenuItem>
                        <MenuItem value="+61">+61 (AU)</MenuItem>
                        <MenuItem value="+49">+49 (DE)</MenuItem>
                        <MenuItem value="+55">+55 (BR)</MenuItem>
                    </Select>
                    <TextField
                        label={title}
                        type={type}
                        variant="outlined"
                        fullWidth
                        required
                        value={formValues[name] || ''}
                        onChange={(e) => handleInputChange(name, e.target.value)}
                        InputProps={{ sx: { borderRadius: 2 } }}
                    />
                </Box>
            );
        }

        // Default rendering for other field types (e.g., first_name, last_name)
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
                    // disabled={isConfirming}
                    sx={{
                        width: '100%',
                        p: 2,
                        borderRadius: 2,
                        ':hover': { background: '#0C0E1D' },
                        bgcolor: '#009FDD',
                    }}
                >
                    Update
                </Button>
            </Box>
        </>
    );
}