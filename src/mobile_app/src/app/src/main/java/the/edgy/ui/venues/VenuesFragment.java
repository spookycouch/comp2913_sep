package the.edgy.ui.venues;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProviders;

import the.edgy.R;

public class VenuesFragment extends Fragment {

    private VenuesViewModel venuesViewModel;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        venuesViewModel =
                ViewModelProviders.of(this).get(VenuesViewModel.class);
        View root = inflater.inflate(R.layout.fragment_venues, container, false);
        final TextView textView = root.findViewById(R.id.text_venues);
        venuesViewModel.getText().observe(this, new Observer<String>() {
            @Override
            public void onChanged(@Nullable String s) {
                textView.setText(s);
            }
        });
        return root;
    }
}