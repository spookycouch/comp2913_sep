package the.edgy.ui.login;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import the.edgy.R;

public class RegisterActivity extends AppCompatActivity {

    private EditText name;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.register_page);

        name = findViewById(R.id.name);
    }

    public void backToLogin(View v) {
        finish();
    }

    public void register(View v) {

        // TODO: manipulate the values in text fields. Example below... (for name field).

        String text = name.getText().toString();

        // This is for debugging. Should output whatever you input in the name field.
        Toast.makeText(getApplicationContext(), text, Toast.LENGTH_SHORT).show();
    }
}
