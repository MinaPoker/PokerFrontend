import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://eglkxepsbbjqqofsrrzb.supabase.co", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export const checkAddress = async (addressToCheck) => {
    try {
        const { data, error } = await supabase
            .from('user_data')
            .select('address') // Select the 'id' field
            .eq('address', addressToCheck); // Check if 'id' equals the value

        if (error) {
            throw error;
        }

        // If data is empty, the value does not exist in the 'id' field
        if (data.length > 0) {
            console.log('supabase data found', data)
            return true;
        }
        else {
            console.log('supabase data not found', data)
            return false;
        }
    } catch (error) {
        console.error('Supabase error:', error);
        return false;
    }
};


export const addPlayerData = async (address, userType, formData) => {
    try {
        const { data, error } = await supabase
            .from('user_data')
            .insert([
                {
                    address: address,
                    name: formData.name,
                    social: formData.social,
                    inviteCode: formData.inviteCode,
                    walletBalance: 0,
                    status: "true",
                    userType: userType,
                },
            ])
            .select()

        if (error) {
            throw error;
        }

        console.log("Supabase data added", data)
    }
    catch (error) {
        console.error('Supabase error:', error);
    }
}

export const createPokerGame = async (address, formData) => {
    try {
        console.log("game data database page ", formData)
        const { data, error } = await supabase
            .from('create_game')
            .insert([
                {
                    gameId: formData.gameId,
                    creatorWallet: address,
                    noOfPlayers: formData.size,
                    lowBetChips: formData.lowBetChips,
                    highBetChips: formData.topBetChips,
                    totalRounds: formData.totalRounds,
                },
            ])
            .select()

        if (error) {
            throw error;
        }

        console.log("game added", data)
    }
    catch (error) {
        console.error('error:', error);
    }
}

// adding 1 user at time to the particular game on Mina Poker
export const addPlayerToGame = async (gameId, address, userAddress) => {
    try {
        const { data, error } = await supabase
            .from('game_players')
            .insert([
                {
                    gameId: gameId,
                    creatorAddress: address,
                    playerAddress: userAddress,
                },
            ])
            .select()

        if (error) {
            throw error;
        }

        console.log("game players added", data)
    }
    catch (error) {
        console.error('error:', error);
    }
}