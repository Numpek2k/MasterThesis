import {
    aggregateRecord,
    getSdkStatus,
    initialize,
    requestPermission,
    SdkAvailabilityStatus
} from "react-native-health-connect";
import {useEffect, useState} from "react";
import {ThemedText} from "@/components/ThemedText";



const getTodayDate = (): Date => {
    return new Date();
};

export function HealthConnectStepCounter() {

    const [last24HoursSteps, setLast24HoursStepCount] = useState<number>(0);

    const initializeHealthConnect = async () => {
        const result = await initialize();
        // console.log({ result });
    };

    const checkAvailability = async () => {
        const status = await getSdkStatus();
        if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
            console.log('SDK is available');
        }

        if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE) {
            console.log('SDK is not available');
        }

        if (
            status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED
        ) {
            console.log('SDK is not available, provider update required');
        }
    };

    const requestSamplePermissions = () => {
        requestPermission([
            {
                accessType: 'read',
                recordType: 'Steps',
            },
            {
                accessType: 'read',
                recordType: 'ExerciseSession',
            }
        ]).then((permissions) => {
            console.log('Granted permissions on request ', { permissions });
        });
    };

    const aggregateLast24HoursSteps = () => {
        aggregateRecord({
            recordType: 'Steps',
            timeRangeFilter: {
                operator: 'between',
                startTime: new Date(getTodayDate().getTime() - 24 * 60 * 60 * 1000).toISOString(),
                endTime: getTodayDate().toISOString(),
            },
        }).then((result) => {
            setLast24HoursStepCount(result.COUNT_TOTAL)
            console.log('Steps last 24: ', { result });

        });
    };

    useEffect(() => {
        initializeHealthConnect()
        checkAvailability()
        // requestSamplePermissions()
        aggregateLast24HoursSteps()
        // const interval = setInterval(() => {
        //     aggregateLast24HoursSteps()
        // }, 10 * 1000);
    }, []);


    return (
        <ThemedText>
            Step Counter last 24 hours: {last24HoursSteps}
        </ThemedText>

    );
}