'use client';

import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

interface Props {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}

export default function MultiSelectDropdown({ label, options, selected, onChange }: Props) {
  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="w-48">
      <Listbox value={selected} onChange={onChange} multiple>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-pointer rounded border bg-white py-2 pl-3 pr-10 text-left text-sm shadow-md">
            <span className="block truncate">{label}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
            </span>
          </Listbox.Button>
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5">
              {options.map((option) => (
                <Listbox.Option
                  key={option}
                  value={option}
                  as={Fragment}
                >
                  {({ active }) => (
                    <li
                      className={`relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                      }`}
                      onClick={() => toggleOption(option)}
                    >
                      <span className={`${selected.includes(option) ? 'font-medium' : 'font-normal'}`}>
                        {option}
                      </span>
                      {selected.includes(option) && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </li>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
