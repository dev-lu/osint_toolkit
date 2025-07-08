import {
    Dialog, DialogTitle, DialogContent,
    DialogActions, Button, Typography, Box,
    Divider, Chip, Stack
} from '@mui/material';
import {
    Thermostat as ThermostatIcon,
    Code as CodeIcon
} from '@mui/icons-material';
import MDEditor from '@uiw/react-md-editor';

const TemplateExampleDialog = ({ open, onClose, template }) => {
    if (!template) return null;
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6">Example: {template.title}</Typography>
                    <Stack direction="row" spacing={1}>
                        <Chip
                            icon={<ThermostatIcon fontSize="small" />}
                            label={`Temp: ${template.temperature?.toFixed(2)}`}
                            size="small"
                        />
                        <Chip
                            icon={<CodeIcon fontSize="small" />}
                            label={template.model}
                            size="small"
                        />
                    </Stack>
                </Stack>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <Box mb={2}>
                    <Typography variant="subtitle1">Description</Typography>
                    <Typography variant="body2">{template.description}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box mb={2}>
                    <Typography variant="subtitle1">Configuration</Typography>
                    <Typography variant="body2"><strong>AI Agent Role:</strong> {template.ai_agent_role}</Typography>
                    <Typography variant="body2"><strong>AI Agent Task:</strong> {template.ai_agent_task}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box>
                    <Typography variant="subtitle1">Example</Typography>
                    <Box
                        p={2}
                        borderRadius={1}
                        sx={{
                            backgroundColor: 'background.paper',
                            '& .wmde-markdown, & .wmde-markdown pre': {
                                backgroundColor: 'transparent !important',
                                padding: 0,
                            },
                        }}
                    >
                        <MDEditor.Markdown
                            source={template.example_input_output || 'No example provided'}
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default TemplateExampleDialog;
