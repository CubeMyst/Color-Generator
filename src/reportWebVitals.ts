import { ReportHandler } from 'web-vitals';

function reportWebVitals({
	onPerfEntry,
}: { onPerfEntry?: ReportHandler } = {}): void {
	if (onPerfEntry && onPerfEntry instanceof Function) {
		import('web-vitals').then(
			({ getCLS, getFID, getFCP, getLCP, getTTFB }): void => {
				getCLS(onPerfEntry);
				getFID(onPerfEntry);
				getFCP(onPerfEntry);
				getLCP(onPerfEntry);
				getTTFB(onPerfEntry);
			}
		);
	}
}

export default reportWebVitals;
