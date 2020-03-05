package the.edgy.ui.home;

import androidx.annotation.NonNull;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import android.os.Bundle;
import android.view.MenuItem;

import com.google.android.material.bottomnavigation.BottomNavigationView;

import the.edgy.R;
import the.edgy.ui.activities.ActivitiesFragment;
import the.edgy.ui.profile.ProfileFragment;
import the.edgy.ui.venues.VenuesFragment;

public class HomePage extends AppCompatActivity {


    // Listener for navigation buttons.
    // Every button opens up a new fragment to put in the fragment container.
    private BottomNavigationView.OnNavigationItemSelectedListener navListener =
            new BottomNavigationView.OnNavigationItemSelectedListener() {
                @Override
                public boolean onNavigationItemSelected(@NonNull MenuItem menuItem) {
                    Fragment selectedFragment = null;

                    // Id changes with different buttons,
                    // so we can detect which button has been clicked.
                    switch (menuItem.getItemId()) {
                        case R.id.navigation_home:
                            selectedFragment = new HomeFragment();
                            break;

                        case R.id.navigation_activities:
                            selectedFragment = new ActivitiesFragment();
                            break;

                        case R.id.navigation_venues:
                            selectedFragment = new VenuesFragment();
                            break;

                        case R.id.navigation_profile:
                            selectedFragment = new ProfileFragment();
                            break;
                    }

                    // Replaces the current fragment in the fragment container with the new
                    // fragment corresponding to the button clicked.
                    getSupportFragmentManager().beginTransaction().replace(R.id.fragment_container,
                            selectedFragment).commit();

                    // Returning true highlights the clicked navigation button.
                    return true;
                }


            };

    // Creates the initial home page.
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.frame_layout);

        BottomNavigationView bottom_navigation = findViewById(R.id.bottom_navigation);

        // Listens for the navigation panel buttons to be pressed.
        bottom_navigation.setOnNavigationItemSelectedListener(navListener);

        // Puts the first (home) fragment in the container, so that it appears
        // right after login has been made.
        getSupportFragmentManager().beginTransaction().replace(R.id.fragment_container,
                new HomeFragment()).commit();


    }

    @Override
    public void onPause() {
        super.onPause();  // Always call the superclass method first
    }
}
