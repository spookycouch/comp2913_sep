package the.edgy.ui.profile;


import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.ViewModelProviders;

import the.edgy.R;
import the.edgy.ui.home.HomePage;
import the.edgy.ui.login.MainActivity;

public class ProfileFragment extends Fragment implements View.OnClickListener {

    private ProfileViewModel profileViewModel;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        profileViewModel =
                ViewModelProviders.of(this).get(ProfileViewModel.class);
        View root = inflater.inflate(R.layout.fragment_profile, container, false);
        final TextView textView = root.findViewById(R.id.text_profile);

        profileViewModel.getText().observe(this, new Observer<String>() {
            @Override
            public void onChanged(@Nullable String s) {
                textView.setText(s);
            }
        });


        Button buyMembership = (Button) root.findViewById(R.id.buy_membership);

        buyMembership.setOnClickListener(this);

        return root;
    }

    @Override
    public void onClick(View v) {

        //TODO: Instead of making another activity, make another fragment.


        Toast.makeText(getActivity(),"HELLO" , Toast.LENGTH_SHORT).show();


        BuyMembershipFragment membershipFragment = new BuyMembershipFragment();

        FragmentManager fm = getFragmentManager();

        if (fm != null) {
            FragmentTransaction ft = fm.beginTransaction();
            ft.add(R.id.frame, membershipFragment);

            ft.commit();
        }

//        Fragment homeFragment = getFragmentManager().findFragmentById(R.id.home_fragment);
//
//        FragmentTransaction transaction2 = getFragmentManager().beginTransaction();
//        transaction2.replace(R.id.profile_fragment, homeFragment);
//        transaction2.addToBackStack(null);
//        transaction2.commit();

//        displayMembership();
    }

    @Override
    public void onPause() {
        super.onPause();
    }

    void displayMembership() {
        // Create an Intent to start the Memberships page.
        Intent membershipIntent = new Intent(getActivity(), MembershipPage.class);

        startActivity(membershipIntent);
    }
}