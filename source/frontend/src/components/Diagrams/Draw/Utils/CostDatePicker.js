import React from 'react';
import { DateRangePicker, FormField } from '@awsui/components-react';
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import * as R from "ramda";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const CostDatePicker = ({ disabled, onIntervalChange }) => {
  const [value, setValue] = React.useState({
    type: 'absolute',
    startDate: dayjs()
      .startOf('month')
      .format('YYYY-MM-DD'),
    endDate: dayjs()
      .endOf('month')
      .format('YYYY-MM-DD'),
  });

  const processDateInterval = (detail) => {
    setValue(detail.value);
    R.equals('absolute', detail.value.type)
      ? onIntervalChange(detail.value)
      : onIntervalChange({
          type: 'relative',
          startDate: dayjs()
            .subtract(detail.value.amount, detail.value.unit)
            .format('YYYY-MM-DD'),
          endDate: dayjs().format('YYYY-MM-DD'),
        });
  };

  return (
    <FormField label='Cost Data Time Period'
               description='The time period for which cost data is calculated.'>
      <DateRangePicker
        disabled={disabled}
        onChange={({ detail }) => processDateInterval(detail)}
        value={value}
        relativeOptions={[
          {
            key: 'previous-7-days',
            amount: 7,
            unit: 'day',
            type: 'relative',
          },
          {
            key: 'previous-30-days',
            amount: 30,
            unit: 'day',
            type: 'relative',
          },
          {
            key: 'previous-3-months',
            amount: 3,
            unit: 'month',
            type: 'relative',
          },
          {
            key: 'previous-1-year',
            amount: 1,
            unit: 'year',
            type: 'relative',
          },
        ]}
        i18nStrings={{
          todayAriaLabel: 'Today',
          nextMonthAriaLabel: 'Next month',
          previousMonthAriaLabel: 'Previous month',
          customRelativeRangeDurationLabel: 'Duration',
          customRelativeRangeDurationPlaceholder: 'Enter duration',
          customRelativeRangeOptionLabel: 'Custom range',
          customRelativeRangeOptionDescription:
            'Set a custom range in the past',
          customRelativeRangeUnitLabel: 'Unit of time',
          formatRelativeRange: (e) => {
            const t = 1 === e.amount ? e.unit : `${e.unit}s`;
            return `Last ${e.amount} ${t}`;
          },
          formatUnit: (e, t) => (1 === t ? e : `${e}s`),
          relativeModeTitle: 'Relative range',
          absoluteModeTitle: 'Absolute range',
          relativeRangeSelectionHeading: 'Choose a range',
          startDateLabel: 'Start date',
          endDateLabel: 'End date',
          startTimeLabel: 'Start time',
          endTimeLabel: 'End time',
          clearButtonLabel: 'Clear',
          cancelButtonLabel: 'Cancel',
          applyButtonLabel: 'Apply',
        }}
        dateOnly
        expandToViewport
        placeholder='Filter by a date and time range'
      />
    </FormField>
  );
};

export default CostDatePicker;
