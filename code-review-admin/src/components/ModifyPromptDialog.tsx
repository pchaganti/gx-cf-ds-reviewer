import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material"
import { useEffect, useState } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"

import { createPrompt, updatePrompt } from "@/src/actions/prompts"
import ConfirmDeletePromptDialog from "@/src/components/ConfirmDeletePromptDialog"
import type { Prompt } from "@/src/utils/api"

type ModifyPromptDialogProps = {
    prompt?: Prompt
    open: boolean
    onClose: () => void
    onFetch: () => void
}

const ModifyPromptDialog = ({
    open, onClose, onFetch, prompt
}: ModifyPromptDialogProps) => {
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            name: prompt?.name || "",
            description: prompt?.description || "",
            model: prompt?.model || "",
            messages: prompt?.messages || [{ role: "system", content: "" }]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "messages"
    })

    useEffect(() => {
        if (prompt) {
            reset({
                name: prompt.name,
                description: prompt.description,
                model: prompt.model,
                messages: prompt.messages
            })
        }
    }, [prompt, reset])

    const onSubmit = async (data: Prompt) => {
        if (prompt) {
            await updatePrompt(data)
        } else {
            await createPrompt(data)
        }
        onFetch()
        onClose()
    }

    const [confirmOpen, setConfirmOpen] = useState(false)

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{prompt ? "Update Prompt" : "Add Prompt"}</DialogTitle>
            <DialogContent>
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <TextField{...field} label="Name" fullWidth margin="normal" />
                    )}
                />
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <TextField{...field} label="Description" fullWidth margin="normal" />
                    )}
                />
                <Controller
                    name="model"
                    control={control}
                    render={({ field }) => (
                        <TextField{...field} label="Model" fullWidth margin="normal" />
                    )}
                />
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                        <Controller
                            name={`messages.${index}.role`}
                            control={control}
                            render={({ field }) => (
                                <FormControl style={{ minWidth: 140 }} margin="normal">
                                    <InputLabel>Role</InputLabel>
                                    <Select{...field}>
                                        <MenuItem value="system">System</MenuItem>
                                        <MenuItem value="user">User</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                        />
                        <Controller
                            name={`messages.${index}.content`}
                            control={control}
                            render={({ field }) => (
                                <TextField{...field} label="Content" multiline fullWidth maxRows={3} margin="normal" />
                            )}
                        />
                        <IconButton onClick={() => remove(index)}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                ))}
                <Button onClick={() => append({ role: "user", content: "" })} startIcon={<AddIcon />}>
                    Add Message
                </Button>
            </DialogContent>
            <DialogActions>
                {prompt && (
                    <Button onClick={() => setConfirmOpen(true)} color="error">
                        Delete
                    </Button>
                )}
                <Button onClick={onClose} color={"inherit"}>Cancel</Button>
                <Button onClick={handleSubmit(onSubmit)} color="primary">
                    {prompt ? "Update" : "Add"}
                </Button>
            </DialogActions>
            <ConfirmDeletePromptDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onFetch={onFetch}
                prompt={prompt}
            />
        </Dialog>
    )
}

export default ModifyPromptDialog
