import { ReactNode, createContext, useState, useReducer, useEffect } from 'react'
import { ActionTypes, Cycle, cyclesReducer } from '../reducers/cycles'
import { differenceInSeconds } from 'date-fns'



interface CreateNewCycleData {
    task: string
    minutesAmount: number
}

interface CyclesContextType {
    cycles: Cycle[]
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    amountSecondsPassed: number
    markCurrentCycleAsFinished: () => void
    setSecondsPassed: (seconds: number) => void
    createNewCycle: (data: CreateNewCycleData) => void
    interruptCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
    children: ReactNode
}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
    const [cyclesState, dispatch] = useReducer(cyclesReducer,
        {
            cycles: [],
            activeCycleId: null
        }, (initialState) =>{
            const storedStateJSON = localStorage.getItem('@ignite-timer:cycles-state-1.0.0');

            if(storedStateJSON){
                return JSON.parse(storedStateJSON)
            }

            return initialState
        }
    )

    const { cycles, activeCycleId } = cyclesState;

    const activeCycle = cycles.find(cycle => cycle.id == activeCycleId);

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(() =>{
        if(activeCycle){
            return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
        }
        
        return 0;
    });

    useEffect(() =>{
        const stateJSON = JSON.stringify(cyclesState)

        localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON);
    }, [cyclesState])

    

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished() {
        dispatch({
            type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
            payload: {
                activeCycleId,
            },
        })
    }

    function createNewCycle(data: CreateNewCycleData) {

        const id = String(new Date().getTime());

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }


        dispatch({
            type: ActionTypes.ADD_NEW_CYCLE,
            payload: {
                newCycle,
            },
        })

        setAmountSecondsPassed(0);
    }

    function interruptCycle() {
        dispatch({
            type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
            payload: {
                activeCycleId,
            },
        })
    }

    return (
        <CyclesContext.Provider
            value={{
                cycles,
                activeCycle,
                activeCycleId,
                amountSecondsPassed,
                setSecondsPassed,
                markCurrentCycleAsFinished,
                createNewCycle,
                interruptCycle,
            }}
        >
            {children}
        </CyclesContext.Provider>
    )
}