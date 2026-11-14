"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { FormInput } from "@/components/form/FormInput";
import { FormTextArea } from "@/components/form/FormTextArea";
import { MultiSelect } from "@/components/form/FormSelection";
import { SelectionData } from "@/models/form/selectionData";
import { createGroup } from "@/lib/supabase/createGroup";
import { GROUP_DESCRIPTION_MAX, GROUP_NAME_MAX, GROUP_NAME_MIN } from "@/models/groups/limits";

interface CreateGroupFormProps {
  options: SelectionData[];
  onCreated: () => void;
}

/**
 * @param options - the interests a group can be built around, the value is the option id as text
 * @param onCreated - the function to call after the group is saved
 */

export const CreateGroupForm = ({ options, onCreated }: CreateGroupFormProps) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [pickedValues, setPickedValues] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // the button stays off until the same rules the database checks are met
  const nameLength = name.trim().length;
  const valid =
    nameLength >= GROUP_NAME_MIN &&
    nameLength <= GROUP_NAME_MAX &&
    description.trim().length <= GROUP_DESCRIPTION_MAX &&
    pickedValues.length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!valid || submitting) return;

    setSubmitting(true);
    setError("");

    const result = await createGroup({ name, description, optionIds: pickedValues.map(Number) });

    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }

    // clear the form so a second group starts fresh, then let the page switch tabs
    setName("");
    setDescription("");
    setPickedValues([]);
    onCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-2xl flex-col gap-y-5">
      <FormInput
        id="group-name"
        label="Group name"
        placeholder="Something people will recognize, like Thrift and Upcycle"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        errorMessage="Give your group a name"
      />
      <FormTextArea
        id="group-description"
        label="Description"
        placeholder="Tell people what this group is about"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <p className="text-subtle text-xs">
        {description.trim().length}/{GROUP_DESCRIPTION_MAX}
      </p>
      <MultiSelect
        id="group-interests"
        label="Interests"
        placeholder="Pick the interests this group is built around"
        options={options}
        value={pickedValues}
        onChange={setPickedValues}
        required
        errorMessage="Pick at least one interest"
      />
      {error && (
        <p role="alert" className="text-danger! text-sm opacity-100!">
          {error}
        </p>
      )}
      <Button primary type="submit" label={submitting ? "Creating..." : "Create group"} disabled={!valid || submitting} />
    </form>
  );
};
