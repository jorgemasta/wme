import React from 'react';
import { __ } from '@wordpress/i18n';

import { StoreLocation, StoreDetails, Complete } from '../screens';

type KeysOfUnion<T> = T extends T ? keyof T: never;

export interface CurrencyInterface {
	[key: string]: string;
}

export interface LabelValueInterface {
	label: string;
	value: string;
}

export interface StateInterface {
	label: string;
	value: string;
}

export interface RegionInterface extends LabelValueInterface {
	country: string;
}

// @todo: Cleanup this interface. We may only require the label and hidden value, and likely not all these nodes.
export interface LocaleInterface {
	postcode?: {
		label?: string;
		priority?: number;
		required: boolean;
		hidden: boolean;
	};
	state: {
		label?: string;
		required?: boolean;
		hidden?: boolean;
	};
	city?: {
		label?: string;
		required?: boolean;
		hidden?: boolean;
	};
	address_2?: {
		required?: boolean;
		hidden?: boolean;
	}
}

export interface LocalesInterface {
	[key: string]: LocaleInterface;
}

export interface StoreSetupWizardObjectInterface {
	id: string;
	completed: boolean;
	addressLineOne: string;
	addressLineTwo: string;
	region: string;
	state: string;
	city: string;
	postCode: string;
	locale: string;
	currency: string;
	productTypes: string[];
	productCount: string;
	currencies: LabelValueInterface[];
	locales: LocalesInterface;
	regions: RegionInterface[];
	states: StateInterface[];
	ajax: StoreBuilderAjaxObject;
}

export interface StoreSetupFormValueInterface {
	value: string | string[];
	touched: boolean;
	isValid: boolean;
}

export interface StoreSetupStepInterface {
	id: number;
	hideBack?: boolean;
	hideSkip?: boolean;
	hideNext?: boolean;
	label?: string;
	nextText?: string;
	hidePagination?: boolean;
	screen?: React.ReactNode;
	disableNext?: boolean;
	disableAll?: boolean;
	disable?: boolean;
}

export interface StoreSetupFormItemsInterface {
	addressLineOne: StoreSetupFormValueInterface;
	addressLineTwo: StoreSetupFormValueInterface;
	region: StoreSetupFormValueInterface;
	state: StoreSetupFormValueInterface;
	city: StoreSetupFormValueInterface;
	postCode: StoreSetupFormValueInterface;
	currency: StoreSetupFormValueInterface;
	productTypes: StoreSetupFormValueInterface;
	productCount: StoreSetupFormValueInterface;
}

export interface StoreSetupScreenDataInterface extends StoreSetupWizardObjectInterface {
	isLoading: boolean;
	lastStep: number;
	steps: Array<StoreSetupStepInterface>;
	form: StoreSetupFormItemsInterface;
}

const stepsData: Array<StoreSetupStepInterface> = [
	{
		id: 0,
		label: __('Location', 'nexcess-mapps'),
		hideBack: true,
		nextText: __('Next', 'nexcess-mapps'),
		screen: <StoreLocation />
	},
	{
		id: 1,
		label: __('Your Store', 'nexcess-mapps'),
		nextText: __('Next', 'nexcess-mapps'),
		screen: <StoreDetails />
	},
	{
		id: 2,
		label: __('Complete', 'nexcess-mapps'),
		hideSkip: true,
		hidePagination: true,
		nextText: __('Save & Exit Setup', 'nexcess-mapps'),
		screen: <Complete />
	}
];

const formItemsData: StoreSetupFormItemsInterface = {
	addressLineOne: {
		value: '',
		touched: false,
		isValid: true
	},
	addressLineTwo: {
		value: '',
		touched: false,
		isValid: true
	},
	region: {
		value: '',
		touched: false,
		isValid: true
	},
	state: {
		value: '',
		touched: false,
		isValid: true
	},
	city: {
		value: '',
		touched: false,
		isValid: true
	},
	postCode: {
		value: '',
		touched: false,
		isValid: true
	},
	currency: {
		value: '',
		touched: false,
		isValid: true
	},
	productTypes: {
		value: [],
		touched: false,
		isValid: true
	},
	productCount: {
		value: '',
		touched: false,
		isValid: true
	}
};

const localData: StoreSetupScreenDataInterface = {
	isLoading: false,
	lastStep: 3,
	steps: stepsData,
	form: formItemsData,
	id: '',
	completed: false,
	addressLineOne: '',
	addressLineTwo: '',
	region: '',
	state: '',
	city: '',
	postCode: '',
	locale: '',
	currency: 'USD',
	productTypes: [],
	productCount: '',
	currencies: [],
	locales: {},
	regions: [],
	states: [],
	ajax: {
		action: '',
		nonce: '',
		url: ''
	},
};

type StoreSetupFormItemsType = KeysOfUnion<StoreSetupFormItemsInterface>;

const setInitialFormValues = (wizardData: StoreSetupWizardObjectInterface): StoreSetupFormItemsInterface => {
	const form = formItemsData;

	Object.keys(formItemsData).forEach((property) => {
		if (property in wizardData) {
			const value = wizardData[ property as StoreSetupFormItemsType ];
			if (typeof value === 'string') {
				form[ property as StoreSetupFormItemsType ].value = value;
			}
		}
	});

	return form;
};

const getStepsData = (disable: boolean) => {
	return stepsData.map((step) => {
		step.disable = disable;
		return step;
	});
};

const StoreSetupScreenData = (): StoreSetupScreenDataInterface => {
	const serverData = window?.sitebuilder_store_details?.wizards.store_setup;
	const { completed } = serverData;
	const formData = serverData
		? setInitialFormValues(serverData)
		: formItemsData;
	const steps = getStepsData(! completed);

	return Object.assign(
		{},
		localData,
		serverData,
		{ steps },
		{ form: formData }
	);
};

export default StoreSetupScreenData;
