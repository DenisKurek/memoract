import React, {useState} from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Modal,
    Animated,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {completionMethods, CompletionMethodType, LocationData} from '@/types/task-types';
import {useDB} from '@/hooks/local-db';
import {router} from 'expo-router';
import QRCodeSetup from './QRCodeSetup';
import LocationSetup from './LocationSetup';
import PhotoSetup from './PhotoSetup';
import FaceIDSetup from './FaceIDSetup';
import GradientContainer from './GradientContainer';
// add header height hook to respect transparent header safe area
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddNewTask() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [completionMethod, setCompletionMethod] = useState<CompletionMethodType | null>(null);
    const [showMethodPicker, setShowMethodPicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Setup modals for different completion methods
    const [showQRSetup, setShowQRSetup] = useState(false);
    const [showLocationSetup, setShowLocationSetup] = useState(false);
    const [showPhotoSetup, setShowPhotoSetup] = useState(false);
    const [showFaceIDSetup, setShowFaceIDSetup] = useState(false);

    // Data storage for completion methods
    const [qrCodeData, setQRCodeData] = useState<string | undefined>();
    const [locationData, setLocationData] = useState<LocationData | undefined>();
    const [photoData, setPhotoData] = useState<string | undefined>();
    const [faceIDData, setFaceIDData] = useState<string | undefined>();

    const {saveTask} = useDB();
    const scaleAnim = useState(new Animated.Value(0))[0];
    const taskIdRef = useState(`task_${Date.now()}`)[0];

    // get header height to offset content (header is transparent)
    const headerHeight = useHeaderHeight?.() ?? 0;
    const insets = useSafeAreaInsets();
    const headerOffset = Math.max(0, headerHeight - (insets?.top ?? 0));

    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const formatTime = (time: Date) => {
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handleTimeChange = (event: any, selectedTime?: Date) => {
        setShowTimePicker(Platform.OS === 'ios');
        if (selectedTime) {
            setTime(selectedTime);
        }
    };

    const getCompletionMethodLabel = () => {
        if (!completionMethod) return 'Select completion method...';
        const method = completionMethods.find(m => m.value === completionMethod);
        return method?.label || 'Select completion method...';
    };

    const handleCompletionMethodSelect = (methodValue: CompletionMethodType) => {
        setCompletionMethod(methodValue);
        setShowMethodPicker(false);

        // Open appropriate setup modal based on selected method
        setTimeout(() => {
            switch (methodValue) {
                case CompletionMethodType.QR_CODE:
                    setShowQRSetup(true);
                    break;
                case CompletionMethodType.GEOLOCATION:
                    setShowLocationSetup(true);
                    break;
                case CompletionMethodType.PHOTO:
                    setShowPhotoSetup(true);
                    break;
                case CompletionMethodType.FACE_ID:
                    setShowFaceIDSetup(true);
                    break;
            }
        }, 300);
    };

    const handleSaveTask = async () => {
        if (!title.trim()) {
            alert('Please enter a task title');
            return;
        }
        if (!description.trim()) {
            alert('Please enter a task description');
            return;
        }
        if (!completionMethod) {
            alert('Please select a completion method');
            return;
        }

        // Check if completion method setup is complete
        if (completionMethod === CompletionMethodType.QR_CODE && !qrCodeData) {
            alert('Please complete QR Code setup');
            setShowQRSetup(true);
            return;
        }
        if (completionMethod === CompletionMethodType.GEOLOCATION && !locationData) {
            alert('Please select a location');
            setShowLocationSetup(true);
            return;
        }
        if (completionMethod === CompletionMethodType.PHOTO && !photoData) {
            alert('Please add a reference photo');
            setShowPhotoSetup(true);
            return;
        }
        if (completionMethod === CompletionMethodType.FACE_ID && !faceIDData) {
            alert('Please complete Face ID setup');
            setShowFaceIDSetup(true);
            return;
        }

        setIsSaving(true);
        try {
            console.log('Attempting to save task with data:', {
                title: title.trim(),
                description: description.trim(),
                completionMethod,
                qrCodeData,
                locationData,
                photoData,
                faceIDData
            });

            await saveTask({
                title: title.trim(),
                description: description.trim(),
                date: date,
                time: formatTime(time),
                completionMethod: completionMethod,
                createdAt: new Date(),
                completed: false,
                qrCode: qrCodeData,
                location: locationData,
                photoUri: photoData,
                faceData: faceIDData,
            });

            console.log('Task saved successfully, showing success modal');

            // Show success animation
            setShowSuccessModal(true);
            Animated.sequence([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 3,
                    useNativeDriver: true,
                }),
                Animated.delay(500),
                Animated.timing(scaleAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setShowSuccessModal(false);
                console.log('Navigating to task list');
                router.push('/(tabs)/task-list');
            });
        } catch (error) {
            console.error('Error saving task:', error);
            alert('Failed to save task. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const getCompletionMethodStatus = () => {
        if (!completionMethod) return null;

        let isComplete = false;
        let statusIcon = 'ellipse-outline';
        let statusColor = '#8a8a8a';

        switch (completionMethod) {
            case CompletionMethodType.QR_CODE:
                isComplete = !!qrCodeData;
                break;
            case CompletionMethodType.GEOLOCATION:
                isComplete = !!locationData;
                break;
            case CompletionMethodType.PHOTO:
                isComplete = !!photoData;
                break;
            case CompletionMethodType.FACE_ID:
                isComplete = !!faceIDData;
                break;
        }

        if (isComplete) {
            statusIcon = 'checkmark-circle';
            statusColor = '#4CAF50';
        }

        return { statusIcon, statusColor, isComplete };
    };

    const status = getCompletionMethodStatus();

    return (
        <GradientContainer>
            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingTop: headerOffset + 12, paddingBottom: (insets?.bottom ?? 0) + 24 }]}
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
            >
                <View style={styles.card}>
                    <Text style={styles.title}>{title || 'New Task'}</Text>
                    <Text style={styles.subtitle}>{description || 'Add description'}</Text>

                    {/* Date and Time Pills */}
                    <View style={styles.metaRow}>
                        <TouchableOpacity
                            style={styles.metaPill}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Ionicons name="calendar-outline" size={20} color="#5AEADC" />
                            <Text style={styles.metaText}>{formatDate(date)}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.metaPill}
                            onPress={() => setShowTimePicker(true)}
                        >
                            <Ionicons name="time-outline" size={20} color="#93C5FD" />
                            <Text style={styles.metaText}>{formatTime(time)}</Text>
                        </TouchableOpacity>

                        {completionMethod && (
                            <TouchableOpacity
                                style={styles.metaPill}
                                onPress={() => setShowMethodPicker(true)}
                            >
                                <Ionicons
                                    name={completionMethods.find(m => m.value === completionMethod)?.icon as any}
                                    size={20}
                                    color="#E9D5FF"
                                />
                                <Text style={styles.metaText}>
                                    {completionMethods.find(m => m.value === completionMethod)?.label.split(' ')[0]}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Task Title */}
                    <Text style={styles.label}>Task Title</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter task title..."
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        value={title}
                        onChangeText={setTitle}
                    />

                    {/* Description */}
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textarea]}
                        placeholder="Add details about your task..."
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />

                    {/* Date Picker */}
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                            textColor="#ffffff"
                        />
                    )}

                    {/* Time Picker */}
                    {showTimePicker && (
                        <DateTimePicker
                            value={time}
                            mode="time"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleTimeChange}
                            textColor="#ffffff"
                        />
                    )}

                    {/* Completion Method */}
                    <View style={styles.methodHeaderRow}>
                        <Text style={styles.label}>Completion Method</Text>
                        {status && (
                            <Ionicons
                                name={status.statusIcon as any}
                                size={20}
                                color={status.statusColor}
                            />
                        )}
                    </View>
                    <TouchableOpacity
                        style={styles.selectButton}
                        onPress={() => setShowMethodPicker(!showMethodPicker)}
                    >
                        <Text style={styles.selectButtonText}>
                            {getCompletionMethodLabel()}
                        </Text>
                        <Ionicons
                            name={showMethodPicker ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color="#8a8a8a"
                        />
                    </TouchableOpacity>

                    {/* Completion Method Options */}
                    {showMethodPicker && (
                        <View style={styles.optionsContainer}>
                            {completionMethods.map((method) => (
                                <TouchableOpacity
                                    key={method.value}
                                    style={[
                                        styles.option,
                                        completionMethod === method.value && styles.optionSelected,
                                    ]}
                                    onPress={() => handleCompletionMethodSelect(method.value)}
                                >
                                    <Ionicons
                                        name={method.icon}
                                        size={20}
                                        color={
                                            completionMethod === method.value ? '#00cfff' : '#fff'
                                        }
                                    />
                                    <Text
                                        style={[
                                            styles.optionText,
                                            completionMethod === method.value &&
                                            styles.optionTextSelected,
                                        ]}
                                    >
                                        {method.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Reconfigure button if method is already set */}
                    {completionMethod && status?.isComplete && (
                        <TouchableOpacity
                            style={styles.reconfigureButton}
                            onPress={() => {
                                switch (completionMethod) {
                                    case CompletionMethodType.QR_CODE:
                                        setShowQRSetup(true);
                                        break;
                                    case CompletionMethodType.GEOLOCATION:
                                        setShowLocationSetup(true);
                                        break;
                                    case CompletionMethodType.PHOTO:
                                        setShowPhotoSetup(true);
                                        break;
                                    case CompletionMethodType.FACE_ID:
                                        setShowFaceIDSetup(true);
                                        break;
                                }
                            }}
                        >
                            <Ionicons name="settings-outline" size={16} color="#00cfff" />
                            <Text style={styles.reconfigureText}>Reconfigure</Text>
                        </TouchableOpacity>
                    )}

                    {/* Save Button */}
                    <TouchableOpacity
                        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                        onPress={handleSaveTask}
                        disabled={isSaving}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#8a2be2', '#00cfff']}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}
                            style={styles.saveButtonGradient}
                        >
                            <Ionicons name="checkmark-circle-outline" size={24} color="#fff"/>
                            <Text style={styles.saveButtonText}>
                                {isSaving ? 'Saving...' : 'Save Task'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Setup Modals */}
            <QRCodeSetup
                visible={showQRSetup}
                onClose={() => setShowQRSetup(false)}
                onSave={setQRCodeData}
                taskId={taskIdRef}
            />
            <LocationSetup
                visible={showLocationSetup}
                onClose={() => setShowLocationSetup(false)}
                onSave={setLocationData}
            />
            <PhotoSetup
                visible={showPhotoSetup}
                onClose={() => setShowPhotoSetup(false)}
                onSave={setPhotoData}
            />
            <FaceIDSetup
                visible={showFaceIDSetup}
                onClose={() => setShowFaceIDSetup(false)}
                onSave={setFaceIDData}
            />

            {/* Success Modal */}
            <Modal
                visible={showSuccessModal}
                transparent
                animationType="none"
            >
                <View style={styles.modalOverlay}>
                    <Animated.View
                        style={[
                            styles.successContainer,
                            {transform: [{scale: scaleAnim}]},
                        ]}
                    >
                        <View style={styles.successCircle}>
                            <Ionicons name="checkmark" size={60} color="#fff"/>
                        </View>
                        <Text style={styles.successText}>Task Added!</Text>
                    </Animated.View>
                </View>
            </Modal>
        </GradientContainer>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 40,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'rgba(30, 30, 47, 0.8)',
        borderRadius: 20,
        padding: 24,
        marginHorizontal: 'auto',
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(138, 43, 226, 0.3)',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#aaa',
        marginBottom: 20,
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 24,
    },
    metaPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(138, 43, 226, 0.3)',
    },
    metaText: {
        fontSize: 15,
        color: '#fff',
        fontWeight: '500',
    },
    label: {
        fontSize: 14,
        color: '#8a8a8a',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: '#fff',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(138, 43, 226, 0.2)',
    },
    textarea: {
        height: 100,
        paddingTop: 14,
    },
    selectButton: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(138, 43, 226, 0.2)',
    },
    selectButtonText: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    optionsContainer: {
        backgroundColor: 'rgba(30, 30, 47, 0.6)',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(138, 43, 226, 0.2)',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    optionSelected: {
        backgroundColor: 'rgba(0, 207, 255, 0.1)',
    },
    optionText: {
        fontSize: 16,
        color: '#fff',
    },
    optionTextSelected: {
        color: '#00cfff',
        fontWeight: '600',
    },
    saveButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 8,
        elevation: 8,
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        gap: 10,
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    successContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    successCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
    },
    successText: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    methodHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    reconfigureButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    reconfigureText: {
        fontSize: 14,
        color: '#00cfff',
        fontWeight: '600',
    },
});
