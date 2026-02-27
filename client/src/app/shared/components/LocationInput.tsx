import { useEffect, useMemo, useState } from "react";
import {
  useController,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import type { LocationIQSuggestion } from "../../lib/types/activity";
import {
  Box,
  debounce,
  List,
  ListItemButton,
  TextField,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import axios from "axios";

type Props<T extends FieldValues> = { label: string } & UseControllerProps<T>;
export default function LocationInput<T extends FieldValues>(props: Props<T>) {
  const { field, fieldState } = useController({ ...props });
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationIQSuggestion[]>([]);
  const [inputValue, setInputValue] = useState(field.value || "");
  const locationUrl =
    "https://api.locationiq.com/v1/autocomplete?key=pk.13238f57319e62eec817c7d89a775d4c&q=tower%20of%20lo%20&limit=5&dedupe=1&";
  const fetchSuggestion = useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query || query.length < 3) {
          setSuggestions([]);
          return;
        }

        setLoading(true);
        try {
          const res = await axios.get<LocationIQSuggestion[]>(
            `${locationUrl}q=${query}`,
          );
          setSuggestions(res.data);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      }, 500),
    [],
  );

  useEffect(() => {
    if (field.value && typeof field.value === "object") {
      setInputValue(field.value.venue || "");
    } else {
      setInputValue(field.value || "");
    }
  }, [field.value]);

  const handleChange = async (value: string) => {
    setInputValue(value);

    if (!value) {
      field.onChange(undefined);
      setSuggestions([]);
      return;
    }
    fetchSuggestion(value);
  };

  const handleSelect = (location: LocationIQSuggestion) => {
    const city =
      location.address.city ||
      location.address.town ||
      location.address.village;
    const venue = location.display_name;
    const latitude = location.lat;
    const longitude = location.lon;
    setInputValue(venue);
    field.onChange({ city, venue, latitude, longitude });
    setSuggestions([]);
  };

  return (
    <Box>
      <TextField
        {...props}
        {...field}
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        fullWidth
        variant="outlined"
        error={!!fieldState.error}
        helperText={fieldState.error?.message}
        slotProps={{
          input: {
            endAdornment: (
              <>
                {loading && (
                  <InputAdornment position="end">
                    <CircularProgress size={30} />
                  </InputAdornment>
                )}
              </>
            ),
          },
        }}
      />

      {suggestions.length > 0 && (
        <List sx={{ border: 1 }}>
          {suggestions.map((suggestions) => (
            <ListItemButton
              divider
              key={suggestions.place_id}
              onClick={() => handleSelect(suggestions)}
            >
              {suggestions.display_name}
            </ListItemButton>
          ))}
        </List>
      )}
    </Box>
  );
}
