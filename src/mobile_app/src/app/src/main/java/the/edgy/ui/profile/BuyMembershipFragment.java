package the.edgy.ui.profile;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProviders;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import the.edgy.R;

public class BuyMembershipFragment extends Fragment {

    private BuyMembershipViewModel buyMembershipViewModel;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        buyMembershipViewModel =
                ViewModelProviders.of(this).get(BuyMembershipViewModel.class);
        View root = inflater.inflate(R.layout.fragment_buy_membership, container, false);
        final TextView textView = root.findViewById(R.id.text_buy_membership);
        buyMembershipViewModel.getText().observe(this, new Observer<String>() {
            @Override
            public void onChanged(@Nullable String s) {
                textView.setText(s);
            }
        });
        return root;
    }
}