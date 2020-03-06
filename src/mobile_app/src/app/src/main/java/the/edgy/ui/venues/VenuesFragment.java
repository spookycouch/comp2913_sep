package the.edgy.ui.venues;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProviders;

import the.edgy.R;
import the.edgy.ui.profile.BuyMembershipFragment;

public class VenuesFragment extends Fragment {

    private Button venues;

    // Show venues button opens a new fragment which shows possible venues to be booked.
    private Button.OnClickListener buttonListener = new
            Button.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Fragment buyMembershipFragment = new ShowVenuesFragment();

                    // Replaces current fragment with a new fragment.
                    getActivity().getSupportFragmentManager().beginTransaction().
                            replace(R.id.fragment_container, buyMembershipFragment, "show_venues_fragment").
                            addToBackStack("show_venues_fragment").
                            commit();
                }
            };

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {

        View root = inflater.inflate(R.layout.fragment_venues, container, false);

        // Create a button.
        venues = (Button) root.findViewById(R.id.show_venues);

        venues.setOnClickListener(buttonListener);

        return root;

    }

}