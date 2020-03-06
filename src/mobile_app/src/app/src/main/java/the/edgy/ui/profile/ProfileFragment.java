package the.edgy.ui.profile;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import androidx.annotation.Nullable;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import the.edgy.R;

public class ProfileFragment extends Fragment {

    private Button buyMembership;

    // Buy Membership button listener which opens up a new fragment where the purchase can be made.
    private Button.OnClickListener buttonListener = new
            Button.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Fragment buyMembershipFragment = new BuyMembershipFragment();

                    // Replaces current fragment with a new fragment.
                    getActivity().getSupportFragmentManager().beginTransaction().
                            replace(R.id.fragment_container, buyMembershipFragment, "buy_membership_fragment").
                            addToBackStack("buy_membership_fragment").
                            commit();
                }
            };

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {

        View root = inflater.inflate(R.layout.fragment_profile, container, false);

        // Create a button.
        buyMembership = (Button) root.findViewById(R.id.buy_membership);

        buyMembership.setOnClickListener(buttonListener);

        return root;
    }


    @Override
    public void onPause() {
        super.onPause();
    }

}